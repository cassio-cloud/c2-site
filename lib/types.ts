/**
 * Schema espelha data/cases.json e data/site.json.
 * Alterações no shape devem refletir aqui — TS pega regressões em build.
 */

/**
 * Item de mídia. `src` é:
 *   - "image" / "video": path local ("media/cases/...") ou URL Blob/Spaces
 *   - "embed": URL completa do YouTube ou Vimeo (renderizado como iframe)
 */
export type MediaItem = {
  type: "image" | "video" | "embed";
  src: string;
};

export type Case = {
  slug: string;
  title: string;
  client: string;
  agency: string;
  director: string;
  year: string;
  description: string;
  media: MediaItem[];
  tags: string[];
  featured: boolean;
  /** Opcional: sobrescreve thumb usada em OG / preview de compartilhamento. */
  cover?: string;
};

export type Logo = {
  name: string;
  src: string;
  large: boolean;
};

export type Studio = {
  name: string;
  location: string;
};

export type Social = {
  name: string;
  url: string;
};

export type TeamMember = {
  name: string;
  role: string;
  code: string;
  photo: string;
};

export type Contact = {
  email: string;
  whatsapp: string;
  whatsappLink: string;
  studios: Studio[];
  social: Social[];
};

export type Site = {
  hero: {
    /** Path local (`media/reel.mp4`) — fallback se `embed` vazio. */
    video: string;
    /** URL YouTube/Vimeo. Tem prioridade sobre `video`. */
    embed?: string;
  };
  logos: Logo[];
  contact: Contact;
  team: TeamMember[];
};
