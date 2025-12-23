export function parseInstagramUrl(url: string): string | null {
  // Handle various Instagram URL formats
  const patterns = [
    /instagram\.com\/([a-zA-Z0-9._]+)/,
    /instagr\.am\/([a-zA-Z0-9._]+)/,
    /^@?([a-zA-Z0-9._]+)$/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1].replace('@', '')
    }
  }
  
  return null
}

export function isValidInstagramUsername(username: string): boolean {
  // Instagram username rules: 1-30 chars, alphanumeric, dots, underscores
  const regex = /^[a-zA-Z0-9._]{1,30}$/
  return regex.test(username)
}
