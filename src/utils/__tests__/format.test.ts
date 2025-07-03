import {
  formatDate,
  formatNumber,
  truncateText,
  calculateManuscriptPages,
  countCharactersNoSpaces,
} from '../format'

describe('Format Utilities', () => {
  describe('formatDate', () => {
    it('should format date string to Japanese format', () => {
      expect(formatDate('2025-06-13')).toBe('2025-06-13')
      expect(formatDate('2024-12-25')).toBe('2024-12-25')
    })

    it('should handle invalid dates', () => {
      expect(() => formatDate('invalid-date')).not.toThrow()
    })
  })

  describe('formatNumber', () => {
    it('should format numbers with comma separators', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1000000)).toBe('1,000,000')
      expect(formatNumber(100)).toBe('100')
    })
  })

  describe('truncateText', () => {
    it('should truncate long text with ellipsis', () => {
      const longText = 'これは非常に長いテキストです。省略される必要があります。'
      expect(truncateText(longText, 10)).toBe('これは非常に長いテキ...')
    })

    it('should not truncate short text', () => {
      const shortText = '短いテキスト'
      expect(truncateText(shortText, 20)).toBe(shortText)
    })

    it('should handle empty text', () => {
      expect(truncateText('', 10)).toBe('')
    })
  })

  describe('calculateManuscriptPages', () => {
    it('should calculate manuscript pages correctly', () => {
      expect(calculateManuscriptPages(400)).toBe(1)
      expect(calculateManuscriptPages(401)).toBe(2)
      expect(calculateManuscriptPages(800)).toBe(2)
      expect(calculateManuscriptPages(1200)).toBe(3)
    })

    it('should use custom chars per page', () => {
      expect(calculateManuscriptPages(500, 500)).toBe(1)
      expect(calculateManuscriptPages(501, 500)).toBe(2)
    })

    it('should handle zero characters', () => {
      expect(calculateManuscriptPages(0)).toBe(0)
    })
  })

  describe('countCharactersNoSpaces', () => {
    it('should count characters excluding spaces', () => {
      expect(countCharactersNoSpaces('Hello World')).toBe(10)
      expect(countCharactersNoSpaces('こんにちは　世界')).toBe(7)
      expect(countCharactersNoSpaces('  空白  だらけ  ')).toBe(5)
    })

    it('should handle empty string', () => {
      expect(countCharactersNoSpaces('')).toBe(0)
    })

    it('should handle string with only spaces', () => {
      expect(countCharactersNoSpaces('   ')).toBe(0)
    })
  })
})