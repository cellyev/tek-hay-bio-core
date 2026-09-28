export type CMSRecord = Record<string, unknown> & {
  id?: string | number
  title?: string | null
  [key: string]: unknown
}
