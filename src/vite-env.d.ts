/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GAS_URL?: string
    readonly VITE_TSUMEGO_GAS_URL?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
