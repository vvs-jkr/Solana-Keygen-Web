import { JsonFormatButton } from '~/features/json-formatter'

interface JsonInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  onError: (error: string) => void
  placeholder?: string
  rows?: number
}

export function JsonInput({
  label,
  value,
  onChange,
  onError,
  placeholder = '{ "name": "Пример", "value": 123 }',
  rows = 12,
}: JsonInputProps) {
  const handleFormat = (formatted: string) => {
    onChange(formatted)
  }

  return (
    <div className="input-section">
      <label>{label}:</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input-field"
        placeholder={placeholder}
        rows={rows}
      />
      <JsonFormatButton input={value} onFormatted={handleFormat} onError={onError} />
    </div>
  )
}
