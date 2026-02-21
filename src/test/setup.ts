import '@testing-library/jest-dom'

// Мокаем Worker API
global.Worker = class Worker {
  constructor(public url: string | URL) {}
  onmessage: ((ev: MessageEvent) => void) | null = null
  onerror: ((ev: ErrorEvent) => void) | null = null
  onmessageerror: ((ev: MessageEvent) => void) | null = null
  postMessage = jest.fn()
  terminate = jest.fn()
  addEventListener = jest.fn()
  removeEventListener = jest.fn()
  dispatchEvent = jest.fn(() => false)
} as unknown as typeof Worker

// Мокаем FileReader
global.FileReader = class FileReader {
  static readonly EMPTY = 0 as const
  static readonly LOADING = 1 as const
  static readonly DONE = 2 as const
  readonly EMPTY = 0 as const
  readonly LOADING = 1 as const
  readonly DONE = 2 as const
  result: string | ArrayBuffer | null = null
  error: DOMException | null = null
  readyState: 0 | 1 | 2 = 0
  onload: ((ev: ProgressEvent<FileReader>) => void) | null = null
  onerror: ((ev: ProgressEvent<FileReader>) => void) | null = null
  onprogress: ((ev: ProgressEvent<FileReader>) => void) | null = null
  onabort: ((ev: ProgressEvent<FileReader>) => void) | null = null
  onloadend: ((ev: ProgressEvent<FileReader>) => void) | null = null
  onloadstart: ((ev: ProgressEvent<FileReader>) => void) | null = null
  readAsText = jest.fn()
  readAsDataURL = jest.fn()
  readAsArrayBuffer = jest.fn()
  readAsBinaryString = jest.fn()
  abort = jest.fn()
  addEventListener = jest.fn()
  removeEventListener = jest.fn()
  dispatchEvent = jest.fn(() => false)
} as unknown as typeof FileReader

// Мокаем URL.createObjectURL
global.URL.createObjectURL = jest.fn()
global.URL.revokeObjectURL = jest.fn()

// Мокаем Blob
global.Blob = class Blob {
  size: number
  type: string
  constructor(_blobParts?: BlobPart[], options?: BlobPropertyBag) {
    this.size = 0
    this.type = options?.type ?? ''
  }
  stream = jest.fn()
  text = jest.fn()
  arrayBuffer = jest.fn()
  bytes = jest.fn()
  slice = jest.fn()
} as unknown as typeof Blob
