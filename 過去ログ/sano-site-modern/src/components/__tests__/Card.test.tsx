import { render, screen } from '@testing-library/react'
import { Card } from '../ui/Card'

describe('Card Component', () => {
  it('renders children content', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    )
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('renders with default variant', () => {
    const { container } = render(<Card>Default</Card>)
    const card = container.firstChild
    expect(card).toHaveStyle({
      background: 'rgb(255, 255, 255)',
      borderRadius: '12px',
      padding: '1.5rem'
    })
  })

  it('renders with bordered variant', () => {
    const { container } = render(<Card variant="bordered">Bordered</Card>)
    const card = container.firstChild
    expect(card).toHaveStyle({
      border: '1px solid rgb(229, 229, 229)',
      borderRadius: '8px',
      padding: '2rem'
    })
  })

  it('renders with elevated variant', () => {
    const { container } = render(<Card variant="elevated">Elevated</Card>)
    const card = container.firstChild
    expect(card).toHaveStyle({
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
    })
  })

  it('applies hover effects when hoverable', () => {
    const { container } = render(<Card hoverable>Hoverable</Card>)
    const card = container.firstChild
    expect(card).toHaveStyle({
      cursor: 'pointer'
    })
  })

  it('accepts motion props', () => {
    const { container } = render(
      <Card
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Animated
      </Card>
    )
    const card = container.firstChild
    expect(card).toBeInTheDocument()
  })
})