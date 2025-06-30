import { useState, useEffect, useCallback } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useAsyncData<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await asyncFunction()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
      console.error('useAsyncData error:', err)
    } finally {
      setLoading(false)
    }
  }, [asyncFunction])

  useEffect(() => {
    execute()
  }, dependencies)

  return { data, loading, error, refetch: execute }
}

// Hook for loading data with cache
export function useCachedData<T>(
  key: string,
  asyncFunction: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minutes default
): AsyncState<T> {
  const getCachedData = (): T | null => {
    if (typeof window === 'undefined') return null
    
    const cached = localStorage.getItem(`cache_${key}`)
    if (!cached) return null
    
    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp > ttl) {
      localStorage.removeItem(`cache_${key}`)
      return null
    }
    
    return data
  }

  const setCachedData = (data: T) => {
    if (typeof window === 'undefined') return
    
    localStorage.setItem(`cache_${key}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }))
  }

  const [data, setData] = useState<T | null>(getCachedData())
  const [loading, setLoading] = useState(!data)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await asyncFunction()
      setData(result)
      setCachedData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [asyncFunction, key])

  useEffect(() => {
    if (!data) {
      execute()
    }
  }, [])

  return { data, loading, error, refetch: execute }
}