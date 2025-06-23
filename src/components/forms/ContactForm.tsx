'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import styled from '@emotion/styled'
import { theme } from '@/styles/theme'
import { Button } from '@/components/ui'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-weight: 500;
  font-size: 0.95rem;
  color: ${theme.colors.light.text};
`

const Input = styled.input<{ hasError?: boolean }>`
  padding: 0.75rem 1rem;
  font-size: 1rem;
  background: ${theme.colors.light.surface};
  border: 1px solid ${props => props.hasError ? '#ef4444' : theme.colors.light.border};
  border-radius: 6px;
  transition: ${theme.transitions.default};
  font-family: ${theme.fonts.sansJp};

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#ef4444' : theme.colors.light.hoverBlue};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(10, 77, 162, 0.1)'};
  }
`

const TextArea = styled.textarea<{ hasError?: boolean }>`
  padding: 0.75rem 1rem;
  font-size: 1rem;
  background: ${theme.colors.light.surface};
  border: 1px solid ${props => props.hasError ? '#ef4444' : theme.colors.light.border};
  border-radius: 6px;
  transition: ${theme.transitions.default};
  resize: vertical;
  min-height: 120px;
  font-family: ${theme.fonts.sansJp};

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#ef4444' : theme.colors.light.hoverBlue};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(10, 77, 162, 0.1)'};
  }
`

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 0.25rem;
`

const SuccessMessage = styled.div`
  padding: 1rem;
  background: #10b981;
  color: white;
  border-radius: 6px;
  text-align: center;
  margin-bottom: 1rem;
`

const contactSchema = z.object({
  name: z.string().min(1, '名前を入力してください').max(50, '名前は50文字以内で入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  subject: z.string().min(1, '件名を入力してください').max(100, '件名は100文字以内で入力してください'),
  message: z.string().min(10, 'メッセージは10文字以上で入力してください').max(1000, 'メッセージは1000文字以内で入力してください'),
})

type ContactFormData = z.infer<typeof contactSchema>

export const ContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Form data:', data)
      setSubmitSuccess(true)
      reset()
      
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    } catch (error) {
      setSubmitError('送信中にエラーが発生しました。もう一度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {submitSuccess && (
        <SuccessMessage>
          お問い合わせありがとうございます。内容を確認次第、ご連絡いたします。
        </SuccessMessage>
      )}
      
      {submitError && (
        <ErrorMessage>{submitError}</ErrorMessage>
      )}

      <FormGroup>
        <Label htmlFor="name">お名前 *</Label>
        <Input
          id="name"
          {...register('name')}
          hasError={!!errors.name}
          disabled={isSubmitting}
        />
        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="email">メールアドレス *</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          hasError={!!errors.email}
          disabled={isSubmitting}
        />
        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="subject">件名 *</Label>
        <Input
          id="subject"
          {...register('subject')}
          hasError={!!errors.subject}
          disabled={isSubmitting}
        />
        {errors.subject && <ErrorMessage>{errors.subject.message}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="message">メッセージ *</Label>
        <TextArea
          id="message"
          {...register('message')}
          hasError={!!errors.message}
          disabled={isSubmitting}
        />
        {errors.message && <ErrorMessage>{errors.message.message}</ErrorMessage>}
      </FormGroup>

      <div style={{ marginTop: '1rem' }}>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? '送信中...' : '送信する'}
        </Button>
      </div>
    </Form>
  )
}