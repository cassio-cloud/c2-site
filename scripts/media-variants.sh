#!/usr/bin/env bash
#
# Gera as variantes web de cada vídeo em public/media/cases.
#
# NUNCA sobrescreve nem apaga o original — só escreve arquivos novos ao lado:
#
#   01.mp4  (original, intocado)   → clique/lightbox: vídeo inteiro, som, controles
#   01.web.mp4                     → player inline na página do case
#   01.preview.mp4                 → tile da home (mudo, em loop, leve)
#   01.poster.jpg                  → primeiro frame, aparece antes do vídeo carregar
#
# O "web" só é re-encodado quando o bitrate é absurdo pra web; nos outros
# casos é remux sem perda (-c copy), que só move o índice `moov` pro início
# do arquivo — o tal do faststart, sem tocar num pixel.
#
# Uso:  bash scripts/media-variants.sh [--force]
#       --force  regera variantes que já existem

set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

FORCE=0
[ "${1:-}" = "--force" ] && FORCE=1

# Acima disso, re-encoda em vez de só remuxar (bits/s).
readonly BITRATE_TETO=8000000
# Largura máxima do preview do tile — que renderiza ~600px na prática.
readonly PREVIEW_LARGURA=1280

processados=0
pulados=0

# `-not -name` evita reprocessar as próprias variantes numa segunda rodada.
while IFS= read -r src; do
  base="${src%.*}"
  preview="${base}.preview.mp4"
  web="${base}.web.mp4"
  poster="${base}.poster.jpg"

  # `.web.mp4` só é esperado para fontes .mov — ver o bloco "Web" adiante.
  precisa_web=0
  case "${src##*.}" in mov | MOV) precisa_web=1 ;; esac

  if [ $FORCE -eq 0 ] && [ -f "$preview" ] && [ -f "$poster" ] &&
    { [ $precisa_web -eq 0 ] || [ -f "$web" ]; }; then
    pulados=$((pulados + 1))
    continue
  fi

  bitrate=$(ffprobe -v error -select_streams v:0 \
    -show_entries stream=bit_rate -of default=nw=1:nk=1 "$src" 2>/dev/null)
  [ -z "$bitrate" ] || [ "$bitrate" = "N/A" ] && bitrate=0
  dur=$(ffprobe -v error -show_entries format=duration \
    -of default=nw=1:nk=1 "$src" 2>/dev/null)

  echo "── $src"

  # Poster: 0,5s adentro pra escapar de fade-in preto no frame 0.
  ss="0.5"
  awk "BEGIN{exit !(${dur:-0} < 1.2)}" && ss="0"
  ffmpeg -nostdin -v error -y -ss "$ss" -i "$src" \
    -frames:v 1 -vf "scale='min(${PREVIEW_LARGURA},iw)':-2" -q:v 4 \
    "$poster" </dev/null && echo "   poster  $(du -h "$poster" | cut -f1)"

  # Preview do tile: mudo (o tile nunca toca som) e teto de bitrate baixo.
  ffmpeg -nostdin -v error -y -i "$src" \
    -an \
    -vf "scale='min(${PREVIEW_LARGURA},iw)':-2" \
    -c:v libx264 -preset medium -crf 27 \
    -maxrate 1200k -bufsize 2400k \
    -pix_fmt yuv420p -movflags +faststart \
    "$preview" </dev/null && echo "   preview $(du -h "$preview" | cut -f1)"

  # Web: só quando o original não serve direto pro browser.
  #
  # Os .mp4 do projeto já vêm com faststart, então o próprio original já
  # começa a tocar nos primeiros KB — copiar seria só dobrar o peso do
  # deploy à toa. Gera variante apenas quando a fonte é .mov (índice no
  # fim do arquivo + container mal suportado fora do Safari).
  if [ "${src##*.}" = "mov" ] || [ "${src##*.}" = "MOV" ]; then
    if [ "$bitrate" -gt "$BITRATE_TETO" ] 2>/dev/null; then
      echo "   web     re-encode ($((bitrate / 1000))kbps acima do teto)"
      ffmpeg -nostdin -v error -y -i "$src" \
        -c:v libx264 -preset medium -crf 20 \
        -maxrate 8000k -bufsize 16000k \
        -pix_fmt yuv420p \
        -c:a aac -b:a 128k \
        -movflags +faststart \
        "$web" </dev/null
    else
      ffmpeg -nostdin -v error -y -i "$src" \
        -c copy -movflags +faststart "$web" </dev/null
    fi
    echo "   web     $(du -h "$web" | cut -f1)"
  fi

  processados=$((processados + 1))
done < <(find public/media/cases -type f \
  \( -name "*.mp4" -o -name "*.mov" -o -name "*.webm" \) \
  -not -name "*.preview.mp4" -not -name "*.web.mp4" | sort)

echo ""
echo "processados: $processados | já existiam: $pulados"
