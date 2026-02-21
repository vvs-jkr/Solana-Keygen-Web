const CANDIDATES = [',', ';', '\t', '|']

/**
 * Определяет разделитель CSV по первым 1000 символам входной строки.
 * Возвращает символ-разделитель с наибольшим числом вхождений.
 */
export function detectDelimiter(csv: string): string {
  const sample = csv.slice(0, 1000)

  let detected = ','
  let maxCount = 0

  for (const delimiter of CANDIDATES) {
    const escaped = delimiter === '\t' ? '\\t' : `\\${delimiter}`
    const count = (sample.match(new RegExp(escaped, 'g')) ?? []).length
    if (count > maxCount) {
      maxCount = count
      detected = delimiter
    }
  }

  return detected
}
