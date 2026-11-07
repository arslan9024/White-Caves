// Self-contained Vite client ambient types (immune to node_modules/vite rebuilds across parallel chats)

interface ImportMetaEnv {
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly SSR: boolean;
  [key: string]: any;
}

interface ImportMeta {
  readonly url: string;
  readonly env: ImportMetaEnv;
  readonly hot?: {
    readonly data: any;
    accept(...args: any[]): void;
    dispose(cb: (data: any) => void): void;
    prune(cb: () => void): void;
    invalidate(message?: string): void;
    on(event: string, cb: (...args: any[]) => void): void;
    off(event: string, cb: (...args: any[]) => void): void;
    send(event: string, data?: any): void;
  };
  glob(pattern: string | string[], options?: Record<string, any>): Record<string, any>;
}

declare module '*.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module '*.svg' {
  const src: string;
  export default src;
}
declare module '*.png' {
  const src: string;
  export default src;
}
declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module '*.jpeg' {
  const src: string;
  export default src;
}
declare module '*.gif' {
  const src: string;
  export default src;
}
declare module '*.webp' {
  const src: string;
  export default src;
}
declare module '*.avif' {
  const src: string;
  export default src;
}
declare module '*.woff' {
  const src: string;
  export default src;
}
declare module '*.woff2' {
  const src: string;
  export default src;
}

