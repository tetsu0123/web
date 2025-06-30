import {
  removeExtraLineBreaks,
  addParagraphIndentation,
  toFullWidth,
  toHalfWidth,
  textToHtml,
  stripHtml,
} from '../text-processing'

describe('Text Processing Utilities', () => {
  describe('removeExtraLineBreaks', () => {
    it('should normalize line breaks', () => {
      const text = 'Line 1\r\nLine 2\r\nLine 3'
      expect(removeExtraLineBreaks(text)).toBe('Line 1\nLine 2\nLine 3')
    })

    it('should remove multiple consecutive line breaks', () => {
      const text = 'Line 1\n\n\n\nLine 2'
      expect(removeExtraLineBreaks(text)).toBe('Line 1\n\nLine 2')
    })

    it('should trim whitespace', () => {
      const text = '  \n\nContent\n\n  '
      expect(removeExtraLineBreaks(text)).toBe('Content')
    })
  })

  describe('addParagraphIndentation', () => {
    it('should add indentation to paragraphs', () => {
      const text = 'Paragraph 1\nParagraph 2'
      expect(addParagraphIndentation(text)).toBe('　Paragraph 1\n　Paragraph 2')
    })

    it('should not add indentation to already indented lines', () => {
      const text = '　Already indented\nNot indented'
      expect(addParagraphIndentation(text)).toBe('　Already indented\n　Not indented')
    })

    it('should skip empty lines', () => {
      const text = 'Paragraph 1\n\nParagraph 2'
      expect(addParagraphIndentation(text)).toBe('　Paragraph 1\n\n　Paragraph 2')
    })

    it('should use custom indent character', () => {
      const text = 'Paragraph'
      expect(addParagraphIndentation(text, '  ')).toBe('  Paragraph')
    })
  })

  describe('toFullWidth', () => {
    it('should convert half-width to full-width', () => {
      expect(toFullWidth('ABC123')).toBe('ＡＢＣ１２３')
      expect(toFullWidth('Hello World!')).toBe('Ｈｅｌｌｏ Ｗｏｒｌｄ！')
    })

    it('should preserve non-ASCII characters', () => {
      expect(toFullWidth('こんにちはABC')).toBe('こんにちはＡＢＣ')
    })
  })

  describe('toHalfWidth', () => {
    it('should convert full-width to half-width', () => {
      expect(toHalfWidth('ＡＢＣ１２３')).toBe('ABC123')
      expect(toHalfWidth('Ｈｅｌｌｏ　Ｗｏｒｌｄ')).toBe('Hello　World')
    })

    it('should preserve non-full-width ASCII characters', () => {
      expect(toHalfWidth('こんにちはＡＢＣ')).toBe('こんにちはABC')
    })
  })

  describe('textToHtml', () => {
    it('should escape HTML special characters', () => {
      expect(textToHtml('<div>Test</div>')).toBe('&lt;div&gt;Test&lt;/div&gt;')
      expect(textToHtml('"Quote"')).toBe('&quot;Quote&quot;')
      expect(textToHtml("It's")).toBe('It&#39;s')
    })

    it('should convert line breaks to br tags', () => {
      expect(textToHtml('Line 1\nLine 2')).toBe('Line 1<br>Line 2')
    })

    it('should handle ampersands', () => {
      expect(textToHtml('A & B')).toBe('A &amp; B')
    })
  })

  describe('stripHtml', () => {
    it('should remove HTML tags', () => {
      expect(stripHtml('<p>Paragraph</p>')).toBe('Paragraph')
      expect(stripHtml('<div><span>Nested</span></div>')).toBe('Nested')
    })

    it('should convert br tags to line breaks', () => {
      expect(stripHtml('Line 1<br>Line 2')).toBe('Line 1\nLine 2')
      expect(stripHtml('Line 1<br />Line 2')).toBe('Line 1\nLine 2')
    })

    it('should unescape HTML entities', () => {
      expect(stripHtml('&lt;div&gt;')).toBe('<div>')
      expect(stripHtml('&quot;Quote&quot;')).toBe('"Quote"')
      expect(stripHtml('A &amp; B')).toBe('A & B')
    })
  })
})