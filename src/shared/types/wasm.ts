export interface VanitySearchPayload {
  prefix: string
  suffix: string
  caseSensitive: boolean
  batchSize: number
}

export interface VanityFoundData {
  address: string
  publicKey: string
  secretKey: string
}

export type WasmOperationType = 'vanity-search' | 'vanity-stop'

export type WasmPayload = VanitySearchPayload

export type WasmResult = VanityFoundData

export interface WorkerMessage {
  status: 'ready' | 'success' | 'error' | 'progress' | 'stopped'
  id?: number
  data?: WasmResult
  checked?: number
  error?: string
}

export type WorkerResponse = WorkerMessage

export interface WorkerTask<T = WasmResult> {
  resolve: (value: T) => void
  reject: (error: Error) => void
}

export interface WorkerRequest {
  id: number
  type: WasmOperationType
  payload: WasmPayload
}
