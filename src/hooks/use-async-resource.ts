import { useCallback, useEffect, useEffectEvent, useState } from 'react'

type AsyncStatus = 'loading' | 'ready' | 'error'

type AsyncState<TKey, TData> = {
  key: TKey
  reloadToken: number
  status: AsyncStatus
  data: TData | null
}

export function useAsyncResource<TKey, TData>(key: TKey, loader: () => Promise<TData>) {
  const runLoader = useEffectEvent(loader)
  const [reloadToken, setReloadToken] = useState(0)
  const [state, setState] = useState<AsyncState<TKey, TData>>({
    key,
    reloadToken: 0,
    status: 'loading',
    data: null,
  })

  useEffect(() => {
    let cancelled = false

    void runLoader()
      .then((data) => {
        if (cancelled) return
        setState({
          key,
          reloadToken,
          status: 'ready',
          data,
        })
      })
      .catch(() => {
        if (cancelled) return
        setState({
          key,
          reloadToken,
          status: 'error',
          data: null,
        })
      })

    return () => {
      cancelled = true
    }
  }, [key, reloadToken])

  const requestChanged = state.key !== key || state.reloadToken !== reloadToken

  return {
    data: requestChanged || state.status !== 'ready' ? null : state.data,
    isLoading: requestChanged || state.status === 'loading',
    hasError: !requestChanged && state.status === 'error',
    reload: useCallback(() => {
      setReloadToken((current) => current + 1)
    }, []),
  }
}
