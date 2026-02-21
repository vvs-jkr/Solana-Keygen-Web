import { useRef, type ChangeEvent } from 'react'
import { Button } from '~/shared/ui'
import { CSV_SAMPLES } from '~/entities/csv'

interface SampleSelectorProps {
  onLoadSample: (csvData: string) => void
  onFileUpload: (file: File) => void
}

export function SampleSelector({ onLoadSample, onFileUpload }: SampleSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onFileUpload(file)
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="input-group">
      <label>Загрузить пример или файл:</label>
      <div className="button-group">
        {CSV_SAMPLES.map(sample => (
          <Button
            key={sample.key}
            size="sm"
            variant="secondary"
            onClick={() => onLoadSample(sample.data)}
          >
            {sample.icon} {sample.label}
          </Button>
        ))}

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <Button size="sm" variant="secondary" onClick={triggerFileUpload}>
          📁 Загрузить файл
        </Button>
      </div>
    </div>
  )
}
