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
  const mockWorker: MockWorker = {
    postMessage: () => {},
    terminate: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
    onmessage: null,
    onerror: null,
    onmessageerror: null,
  }

  setTimeout(() => {
    if (mockWorker.onmessage) {
      mockWorker.onmessage(new MessageEvent('message', { data: { status: 'ready' } }))
    }
  }, 0)

  return mockWorker
}
