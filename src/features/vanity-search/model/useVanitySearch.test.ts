import { renderHook, act } from '@testing-library/react'
import { useVanitySearch } from './useVanitySearch'

// Controlled mock worker — recreated for each test via createWorker()
let mockWorker: {
  onmessage: ((e: MessageEvent) => void) | null
  onerror: (() => void) | null
  onmessageerror: null
  postMessage: jest.Mock
  terminate: jest.Mock
  addEventListener: jest.Mock
  removeEventListener: jest.Mock
  dispatchEvent: jest.Mock
}

jest.mock('~/shared/api/workerFactory', () => ({
  createWorker: () => {
    mockWorker = {
      onmessage: null,
      onerror: null,
      onmessageerror: null,
      postMessage: jest.fn(),
      terminate: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(() => false),
    }
    return mockWorker
  },
}))

const defaultConfig = {
  prefix: 'Sol',
  suffix: '',
  caseSensitive: true,
  batchSize: 1000,
}

function sendWorkerMessage(data: object) {
  act(() => {
    const { onmessage } = mockWorker
    if (onmessage) onmessage(new MessageEvent('message', { data }))
  })
}

describe('useVanitySearch', () => {
  it('начальное состояние — idle', () => {
    const { result } = renderHook(() => useVanitySearch())

    expect(result.current.state).toEqual({
      status: 'idle',
      checked: 0,
      result: null,
      error: null,
    })
  })

  it('start() переводит в состояние searching', () => {
    const { result } = renderHook(() => useVanitySearch())

    act(() => {
      result.current.start(defaultConfig)
    })

    expect(result.current.state.status).toBe('searching')
    expect(result.current.state.checked).toBe(0)
    expect(result.current.state.result).toBeNull()
  })

  it('start() отправляет vanity-search сообщение воркеру', () => {
    const { result } = renderHook(() => useVanitySearch())

    act(() => {
      result.current.start(defaultConfig)
    })

    expect(mockWorker.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'vanity-search',
        payload: expect.objectContaining({
          prefix: 'Sol',
          suffix: '',
          caseSensitive: true,
        }),
      })
    )
  })

  it('сообщение progress обновляет счётчик checked', () => {
    const { result } = renderHook(() => useVanitySearch())
    act(() => { result.current.start(defaultConfig) })

    sendWorkerMessage({ status: 'progress', checked: 50_000 })

    expect(result.current.state.checked).toBe(50_000)
    expect(result.current.state.status).toBe('searching')
  })

  it('сообщение success переводит в found и сохраняет результат', () => {
    const { result } = renderHook(() => useVanitySearch())
    act(() => { result.current.start(defaultConfig) })

    const keypair = { address: 'SolAbc123', publicKey: 'pubkey123', secretKey: 'secret123' }
    sendWorkerMessage({ status: 'success', data: keypair })

    expect(result.current.state.status).toBe('found')
    expect(result.current.state.result).toEqual(keypair)
  })

  it('stop() отправляет vanity-stop и переводит в stopped', () => {
    const { result } = renderHook(() => useVanitySearch())
    act(() => { result.current.start(defaultConfig) })

    act(() => { result.current.stop() })

    expect(mockWorker.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'vanity-stop' })
    )
    expect(result.current.state.status).toBe('stopped')
  })

  it('reset() возвращает в idle', () => {
    const { result } = renderHook(() => useVanitySearch())
    act(() => { result.current.start(defaultConfig) })
    sendWorkerMessage({ status: 'progress', checked: 10_000 })

    act(() => { result.current.reset() })

    expect(result.current.state).toEqual({
      status: 'idle',
      checked: 0,
      result: null,
      error: null,
    })
  })

  it('сообщение error переводит в состояние error', () => {
    const { result } = renderHook(() => useVanitySearch())
    act(() => { result.current.start(defaultConfig) })

    sendWorkerMessage({ status: 'error', error: 'WASM не инициализирован' })

    expect(result.current.state.status).toBe('error')
    expect(result.current.state.error).toBe('WASM не инициализирован')
  })

  it('при ошибке без сообщения подставляется дефолтный текст', () => {
    const { result } = renderHook(() => useVanitySearch())
    act(() => { result.current.start(defaultConfig) })

    sendWorkerMessage({ status: 'error' })

    expect(result.current.state.error).toBe('Unknown error')
  })

  it('воркер завершается при размонтировании компонента', () => {
    const { unmount } = renderHook(() => useVanitySearch())
    unmount()

    expect(mockWorker.terminate).toHaveBeenCalledTimes(1)
  })
})
