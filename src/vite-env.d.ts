/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_GOOGLE_CLIENT_ID?: string
  readonly VITE_INSTAPAY_NUMBER?: string
  readonly VITE_VODAFONE_CASH_NUMBER?: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
