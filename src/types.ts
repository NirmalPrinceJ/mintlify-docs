export interface DocsConfig {
  $schema?: string;
  theme?: string;
  name: string;
  colors?: {
    primary?: string;
    light?: string;
    dark?: string;
  };
  favicon?: string;
  navigation: {
    pages: (
      | string
      | {
          group: string;
          pages: string[];
          icon?: string;
        }
    )[];
    global?: {
      anchors?: {
        anchor: string;
        href: string;
        icon?: string;
      }[];
    };
    tabs?: {
      tab: string;
      href?: string;
    }[];
  };
  logo?: {
    light?: string;
    dark?: string;
    href?: string;
  };
  navbar?: {
    links?: {
      label: string;
      href: string;
    }[];
    primary?: {
      type: string;
      label: string;
      href: string;
    };
  };
  contextual?: {
    options?: string[];
  };
  footer?: {
    socials?: Record<string, string>;
  };
}

export interface DocPage {
  id: string; // e.g. "index" or "quickstart"
  title: string;
  description?: string;
  content: string; // raw MDX/markdown
  group?: string;
}

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}
