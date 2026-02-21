
interface CsvInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  errorLine?: number
}

export function CsvInput({
  value,
  onChange,
  placeholder = 'name,age,city\nИван,25,Москва\nАнна,30,СПб',
  errorLine,
}: CsvInputProps) {
  return (
    <div className="input-group">
      <label>CSV данные:</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input-field"
        placeholder={placeholder}
        rows={10}
        style={{ fontFamily: 'monospace', fontSize: '14px' }}
        title={errorLine ? `Ошибка в строке ${errorLine}` : undefined}
      />
    </div>
  )
}
