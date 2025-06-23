'use client'

import styled from '@emotion/styled'
import { theme } from '@/styles/theme'

const TextAreaWrapper = styled.div`
  position: relative;
  width: 100%;
`

const StyledTextArea = styled.textarea`
  width: 100%;
  min-height: 300px;
  padding: 1rem;
  font-family: ${theme.fonts.sansJp};
  font-size: 1rem;
  line-height: 1.6;
  background: ${theme.colors.light.surface};
  border: 1px solid ${theme.colors.light.border};
  border-radius: 8px;
  resize: vertical;
  transition: ${theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${theme.colors.light.hoverBlue};
    box-shadow: 0 0 0 3px rgba(10, 77, 162, 0.1);
  }

  &::placeholder {
    color: ${theme.colors.light.textLight};
  }
`

const CharCount = styled.div`
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  font-size: 0.8rem;
  color: ${theme.colors.light.textLight};
  background: ${theme.colors.light.surface};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  pointer-events: none;
`

interface TextAreaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  showCharCount?: boolean
  rows?: number
}

export const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder = 'ここにテキストを入力してください',
  showCharCount = false,
  rows = 10,
}) => {
  const charCount = value.replace(/\s/g, '').length

  return (
    <TextAreaWrapper>
      <StyledTextArea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
      {showCharCount && <CharCount>{charCount} 文字</CharCount>}
    </TextAreaWrapper>
  )
}