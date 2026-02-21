import * as wasmLoader from '../../src/shared/api/wasm-loader'

describe('loadWasm', () => {
  it('должна быть функцией', () => {
    expect(typeof wasmLoader.loadWasm).toBe('function')
  })
})
