import * as wasmLoader from '../../src/shared/api/wasm-loader'

describe('loadWasm', () => {
  it('должна быть функцией', () => {
    expect(typeof wasmLoader.loadWasm).toBe('function')
  })

  it('возвращает объект WASM-модуля с нужными функциями', async () => {
    const wasm = await wasmLoader.loadWasm()
    expect(typeof wasm.find_vanity_batch).toBe('function')
    expect(typeof wasm.validate_vanity_input).toBe('function')
    expect(typeof wasm.estimate_attempts).toBe('function')
  })

  it('повторный вызов возвращает тот же экземпляр (singleton)', async () => {
    const first = await wasmLoader.loadWasm()
    const second = await wasmLoader.loadWasm()
    expect(second).toBe(first)
  })
})
