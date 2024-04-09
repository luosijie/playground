/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUB_DOMAIN: string
}
  
interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare module '*glsl' {
    const content: string
    export default content
}