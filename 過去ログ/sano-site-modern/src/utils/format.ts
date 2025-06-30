/**
 * Format date string to Japanese format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\//g, '-')
}

/**
 * Format number with comma separators
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('ja-JP')
}

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Calculate manuscript pages from character count
 */
export const calculateManuscriptPages = (
  charCount: number, 
  charsPerPage: number = 400
): number => {
  return Math.ceil(charCount / charsPerPage)
}

/**
 * Remove whitespace and count characters
 */
export const countCharactersNoSpaces = (text: string): number => {
  return text.replace(/\s/g, '').length
}