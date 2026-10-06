export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export const getToken = () => localStorage.getItem('nt_token')

export async function api<T = any>(
  path: string,
  opts: {
    method?: string
    body?: unknown
  } = {}
): Promise<T> {
  const token = getToken()

  const response = await fetch(
    API_BASE + '/api' + path,
    {
      method: opts.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token
          ? {
              Authorization: 'Bearer ' + token
            }
          : {})
      },
      body: opts.body
        ? JSON.stringify(opts.body)
        : undefined
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      data.error ||
      data.details ||
      'حدث خطأ، حاول مرة أخرى.'
    )
  }

  return data
}