export interface SolanaKeypair {
  address: string
  publicKey: string
  secretKey: string
}

export interface VanitySearchConfig {
  prefix: string
  suffix: string
  caseSensitive: boolean
  batchSize: number
}

export type VanitySearchStatus = 'idle' | 'searching' | 'found' | 'stopped' | 'error'

export interface VanitySearchState {
  status: VanitySearchStatus
  checked: number
  result: SolanaKeypair | null
  error: string | null
}
