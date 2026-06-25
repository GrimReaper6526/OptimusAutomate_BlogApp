/**
 * Estimate reading time from raw or HTML content (~200 wpm).
 */
export function calcReadingTime(content = '') {
  const text = String(content).replace(/<[^>]*>/g, ' ')
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export default calcReadingTime
