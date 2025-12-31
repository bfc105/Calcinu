/// <reference types="vite/client" />

interface ImportMeta {
  readonly glob: (
    glob: string,
    options?: { eager?: boolean }
  ) => Record<string, { default: any }>;
}
