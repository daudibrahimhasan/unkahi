export function getDeviceInfo() {
  if (typeof window === 'undefined') return {
    browser: 'unknown',
    device: 'unknown',
    fingerprint: 'unknown'
  }

  const ua = navigator.userAgent
  let browser = 'Unknown'
  let device = 'Desktop'

  if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Chrome')) browser = 'Chrome'
  else if (ua.includes('Safari')) browser = 'Safari'
  else if (ua.includes('Edge')) browser = 'Edge'

  if (/Mobile|Android|iPhone/i.test(ua)) device = 'Mobile'
  else if (/Tablet|iPad/i.test(ua)) device = 'Tablet'

  // Very simple fingerprinting
  const fingerprint = btoa(ua + screen.width + screen.height).slice(0, 16)

  return {
    browser,
    device,
    fingerprint
  }
}
