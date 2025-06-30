'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import styled from '@emotion/styled'
import { theme } from '@/styles/theme'
import { Container } from './common'
import { Button } from './ui'

const ErrorContainer = styled.div`
  text-align: center;
  padding: 4rem 0;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 2rem;
`

const ErrorTitle = styled.h1`
  font-family: ${theme.fonts.serifJp};
  font-size: 2rem;
  margin-bottom: 1rem;
  color: ${theme.colors.light.text};
`

const ErrorMessage = styled.p`
  font-size: 1.1rem;
  color: ${theme.colors.light.textLight};
  line-height: 1.8;
  margin-bottom: 2rem;
`

const ErrorDetails = styled.details`
  margin-top: 2rem;
  padding: 1rem;
  background: ${theme.colors.light.surface};
  border: 1px solid ${theme.colors.light.border};
  border-radius: 8px;
  text-align: left;
  max-width: 600px;
  width: 100%;

  summary {
    cursor: pointer;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  pre {
    margin-top: 1rem;
    padding: 1rem;
    background: ${theme.colors.light.bg};
    border-radius: 4px;
    overflow-x: auto;
    font-size: 0.85rem;
  }
`

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>
      }

      return (
        <Container>
          <ErrorContainer>
            <ErrorIcon>⚠️</ErrorIcon>
            <ErrorTitle>エラーが発生しました</ErrorTitle>
            <ErrorMessage>
              申し訳ございません。予期しないエラーが発生しました。<br />
              ページを再読み込みするか、しばらく時間をおいてから再度お試しください。
            </ErrorMessage>
            <Button onClick={() => window.location.reload()}>
              ページを再読み込み
            </Button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <ErrorDetails>
                <summary>エラーの詳細（開発環境のみ）</summary>
                <pre>{this.state.error.toString()}</pre>
                {this.state.errorInfo && (
                  <pre>{this.state.errorInfo.componentStack}</pre>
                )}
              </ErrorDetails>
            )}
          </ErrorContainer>
        </Container>
      )
    }

    return this.props.children
  }
}