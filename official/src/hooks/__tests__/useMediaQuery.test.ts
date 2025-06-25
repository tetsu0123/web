import { renderHook } from '@testing-library/react'
import { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop } from '../useMediaQuery'

// Mock window.matchMedia
const mockMatchMedia = (matches: boolean) => {
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))
}

describe('useMediaQuery', () => {
  beforeEach(() => {
    mockMatchMedia(false)
  })

  it('returns false when media query does not match', () => {
    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'))
    expect(result.current).toBe(false)
  })

  it('returns true when media query matches', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'))
    expect(result.current).toBe(true)
  })

  it('updates when media query changes', () => {
    let listeners: Array<(event: MediaQueryListEvent) => void> = []
    
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      addEventListener: jest.fn((type, listener) => {
        if (type === 'change') listeners.push(listener)
      }),
      removeEventListener: jest.fn((type, listener) => {
        if (type === 'change') {
          listeners = listeners.filter(l => l !== listener)
        }
      }),
    }))

    const { result, rerender } = renderHook(() => useMediaQuery('(max-width: 768px)'))
    expect(result.current).toBe(false)

    // Simulate media query change
    listeners.forEach(listener => {
      listener({ matches: true } as MediaQueryListEvent)
    })

    rerender()
    expect(result.current).toBe(true)
  })
})

describe('Media query hooks', () => {
  it('useIsMobile returns correct value', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('useIsTablet returns correct value', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => useIsTablet())
    expect(result.current).toBe(true)
  })

  it('useIsDesktop returns correct value', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => useIsDesktop())
    expect(result.current).toBe(false)
  })
})