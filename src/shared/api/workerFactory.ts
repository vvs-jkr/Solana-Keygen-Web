export function createWorker() {
  if (typeof window !== 'undefined' && window.document) {
    return new Worker(new URL('../../worker.ts', import.meta.url), { type: 'module' })
  }
  return createMockWorker()
}

interface MockWorker extends Omit<Worker, 'postMessage' | 'terminate'> {
  postMessage: (message: unknown) => void
  terminate: () => void
}

function createMockWorker(): MockWorker {
  const mockWorker = {
    postMessage: () => {},
    terminate: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
    onmessage: null as ((event: MessageEvent) => void) | null,
    onerror: null as ((event: ErrorEvent) => void) | null,
    onmessageerror: null as ((event: MessageEvent) => void) | null,
  } as MockWorker

  setTimeout(() => {
    if (mockWorker.onmessage) {
      mockWorker.onmessage({ data: { status: 'ready' } } as MessageEvent)
    }
  }, 0)

  return mockWorker
}
