import * as wasm from '@wasm/wasm_lib.js'

// New wasm-pack bundler format: module auto-initializes on import via __wbindgen_start()
let wasmInstance: typeof wasm | null = null

export const loadWasm = async () => {
  if (!wasmInstance) {
    wasmInstance = wasm
  }
  return wasmInstance
}
