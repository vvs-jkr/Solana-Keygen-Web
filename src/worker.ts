import type { WorkerRequest, WorkerMessage, VanitySearchPayload } from './shared/types'
import { loadWasm } from './shared/api/wasm-loader'

let wasmModule: any = null
let stopRequested = false

async function initWasm() {
  wasmModule = await loadWasm()
  self.postMessage({ status: 'ready' } as WorkerMessage)
}

initWasm().catch(error => {
  self.postMessage({
    status: 'error',
    id: -1,
    error: `Init failed: ${error.message}`,
  } as WorkerMessage)
})

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { id, type, payload } = event.data

  if (type === 'vanity-stop') {
    stopRequested = true
    return
  }

  if (!wasmModule) {
    self.postMessage({ status: 'error', id, error: 'WASM not initialized' } as WorkerMessage)
    return
  }

  if (type === 'vanity-search') {
    const { prefix, suffix, caseSensitive, batchSize } = payload as VanitySearchPayload
    stopRequested = false
    let totalChecked = 0

    while (!stopRequested) {
      const result = wasmModule.find_vanity_batch(prefix, suffix, caseSensitive, batchSize)
      totalChecked += batchSize

      if (result !== null) {
        const found = JSON.parse(result)
        self.postMessage({ status: 'success', id, data: found } as WorkerMessage)
        return
      }

      self.postMessage({ status: 'progress', id, checked: totalChecked } as WorkerMessage)

      // yield to event loop so stop message can be processed
      await new Promise(resolve => setTimeout(resolve, 0))
    }

    self.postMessage({ status: 'stopped', id } as WorkerMessage)
    return
  }

  self.postMessage({ status: 'error', id, error: `Unknown task type: ${type}` } as WorkerMessage)
}

export {}
