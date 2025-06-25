/**
 * Remove extra line breaks from text
 */
export const removeExtraLineBreaks = (text: string): string => {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * Add indentation to paragraphs (字下げ)
 */
export const addParagraphIndentation = (
  text: string, 
  indentChar: string = '　'
): string => {
  return text
    .split('\n')
    .map(line => {
      if (line.trim() === '') return line
      if (line.startsWith(indentChar)) return line
      return indentChar + line
    })
    .join('\n')
}

/**
 * Convert half-width to full-width characters
 */
export const toFullWidth = (text: string): string => {
  return text.replace(/[A-Za-z0-9]/g, char => {
    return String.fromCharCode(char.charCodeAt(0) + 0xFEE0)
  })
}

/**
 * Convert full-width to half-width characters
 */
export const toHalfWidth = (text: string): string => {
  return text.replace(/[Ａ-Ｚａ-ｚ０-９]/g, char => {
    return String.fromCharCode(char.charCodeAt(0) - 0xFEE0)
  })
}

/**
 * Convert text to HTML format
 */
export const textToHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, '<br>')
}

/**
 * Strip HTML tags from text
 */
export const stripHtml = (html: string): string => {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}