import type { WorkerRequest, WorkerMessage } from './shared/types'
import { loadWasm } from './shared/api/wasm-loader'

type WasmModule = Awaited<ReturnType<typeof loadWasm>>

let wasmModule: WasmModule | null = null
let stopRequested = false

function send(msg: WorkerMessage) {
  self.postMessage(msg)
}

async function initWasm() {
  wasmModule = await loadWasm()
  send({ status: 'ready' })
}

initWasm().catch((error: Error) => {
  send({ status: 'error', id: -1, error: `Init failed: ${error.message}` })
})

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const msg = event.data

  if (msg.type === 'vanity-stop') {
    stopRequested = true
    return
  }

  // narrowed to vanity-search
  const { id, payload } = msg

  if (!wasmModule) {
    send({ status: 'error', id, error: 'WASM not initialized' })
    return
  }

  const { prefix, suffix, caseSensitive, batchSize } = payload
  stopRequested = false
  let totalChecked = 0

  while (!stopRequested) {
    const result: string | null = wasmModule.find_vanity_batch(prefix, suffix, caseSensitive, batchSize)
    totalChecked += batchSize

    if (result !== null) {
      send({ status: 'success', id, data: JSON.parse(result) })
      return
    }

    send({ status: 'progress', id, checked: totalChecked })

    // yield to event loop so stop message can be processed
    await new Promise(resolve => setTimeout(resolve, 0))
  }

  send({ status: 'stopped', id })
}

export {}
