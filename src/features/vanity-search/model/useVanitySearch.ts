import { useState, useRef, useEffect, useCallback } from 'react'
import { createWorker } from '~/shared/api/workerFactory'
import type { WorkerMessage } from '~/shared/types'
import type { VanitySearchConfig, VanitySearchState, SolanaKeypair } from '~/entities/solana-keypair/types'

const BATCH_SIZE = 50_000

export function useVanitySearch() {
  const [state, setState] = useState<VanitySearchState>({
    status: 'idle',
    checked: 0,
    result: null,
    error: null,
  })

  const workerRef = useRef<Worker | null>(null)
  const workerReadyRef = useRef(false)
  const searchIdRef = useRef(0)

  useEffect(() => {
    const worker = createWorker()
    workerRef.current = worker

    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const msg = event.data

      if (msg.status === 'ready') {
        workerReadyRef.current = true
        return
      }

      if (msg.status === 'progress' && msg.checked !== undefined) {
        setState(prev => ({ ...prev, checked: msg.checked! }))
        return
      }

      if (msg.status === 'success' && msg.data) {
        setState({
          status: 'found',
          checked: 0,
          result: msg.data as SolanaKeypair,
          error: null,
        })
        return
      }

      if (msg.status === 'stopped') {
        setState(prev => ({ ...prev, status: 'stopped' }))
        return
      }

      if (msg.status === 'error') {
        setState(prev => ({ ...prev, status: 'error', error: msg.error ?? 'Unknown error' }))
      }
    }

    worker.onerror = () => {
      setState(prev => ({ ...prev, status: 'error', error: 'Worker crashed' }))
    }

    return () => {
      worker.terminate()
    }
  }, [])

  const start = useCallback((config: VanitySearchConfig) => {
    if (!workerRef.current) return

    const id = ++searchIdRef.current
    setState({ status: 'searching', checked: 0, result: null, error: null })

    workerRef.current.postMessage({
      id,
      type: 'vanity-search',
      payload: {
        prefix: config.prefix,
        suffix: config.suffix,
        caseSensitive: config.caseSensitive,
        batchSize: config.batchSize ?? BATCH_SIZE,
      },
    })
  }, [])

  const stop = useCallback(() => {
    if (!workerRef.current) return
    workerRef.current.postMessage({ id: 0, type: 'vanity-stop', payload: {} as any })
    setState(prev => ({ ...prev, status: 'stopped' }))
  }, [])

  const reset = useCallback(() => {
    setState({ status: 'idle', checked: 0, result: null, error: null })
  }, [])

  return { state, start, stop, reset }
}
