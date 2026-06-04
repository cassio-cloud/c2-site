import { ImageResponse } from "next/og";

/**
 * OG image padrão da home. 1200×630, gerado on-demand pelo Next.
 * Páginas de case têm seu próprio OG (a primeira mídia do case).
 *
 * Importante: Satori (engine do next/og) exige `display: flex` em
 * qualquer <div> com >1 filho — comportamento diferente do navegador.
 */

export const runtime = "edge";
export const alt = "C2 Content — where content meets craft.";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default async function HomeOG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#0d0d0d",
          color: "#efefef",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 36,
            fontWeight: 800,
            letterSpacing: "-0.04em",
          }}
        >
          C2.
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 800,
              letterSpacing: "-0.045em",
              lineHeight: 1,
              textTransform: "lowercase",
              whiteSpace: "pre-wrap",
            }}
          >
            {"where content\nmeets craft."}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontSize: 22,
              fontFamily: "monospace",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(239,239,239,0.55)",
            }}
          >
            Rio Grande do Sul · São Paulo · C2 Content
          </div>
        </div>
      </div>
    ),
    size,
  );
}
