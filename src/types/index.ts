/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export type CMSRecord = Record<string, unknown> & {
  id?: string | number
  title?: string | null
  [key: string]: unknown
}
