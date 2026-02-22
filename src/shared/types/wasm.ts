interface VanitySearchPayload {
  prefix: string
  suffix: string
  caseSensitive: boolean
  batchSize: number
}

interface VanityFoundData {
  address: string
  publicKey: string
  secretKey: string
}

export interface WorkerMessage {
  status: 'ready' | 'success' | 'error' | 'progress' | 'stopped'
  id?: number
  data?: VanityFoundData
  checked?: number
  error?: string
}

// Discriminated union — vanity-stop не требует payload
export type WorkerRequest =
  | { id: number; type: 'vanity-search'; payload: VanitySearchPayload }
  | { id: number; type: 'vanity-stop' }
