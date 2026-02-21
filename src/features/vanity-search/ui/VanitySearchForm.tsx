import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
import { Badge } from '~/components/ui/badge'
import { Alert, AlertDescription } from '~/components/ui/alert'
import type { VanitySearchConfig } from '~/entities/solana-keypair/types'

interface Props {
  isSearching: boolean
  onStart: (config: VanitySearchConfig) => void
  onStop: () => void
}

function estimateAttempts(prefixLen: number, suffixLen: number, caseSensitive: boolean): number {
  const base = caseSensitive ? 58 : 34
  return Math.pow(base, prefixLen + suffixLen)
}

function difficultyLabel(attempts: number): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
  if (attempts < 100_000) return { label: 'Мгновенно', variant: 'default' }
  if (attempts < 10_000_000) return { label: '< 1 сек', variant: 'secondary' }
  if (attempts < 500_000_000) return { label: '~10 сек', variant: 'outline' }
  return { label: '~10+ мин', variant: 'destructive' }
}

const BASE58 = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]*$/

export function VanitySearchForm({ isSearching, onStart, onStop }: Props) {
  const [prefix, setPrefix] = useState('')
  const [suffix, setSuffix] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(true)
  const [validationError, setValidationError] = useState<string | null>(null)

  const totalLen = prefix.length + suffix.length
  const attempts = totalLen > 0 ? estimateAttempts(prefix.length, suffix.length, caseSensitive) : 0
  const difficulty = attempts > 0 ? difficultyLabel(attempts) : null

  function validate(): boolean {
    if (!prefix && !suffix) {
      setValidationError('Укажите префикс или суффикс')
      return false
    }
    if (prefix && !BASE58.test(prefix)) {
      setValidationError('Префикс содержит недопустимые символы (только base58)')
      return false
    }
    if (suffix && !BASE58.test(suffix)) {
      setValidationError('Суффикс содержит недопустимые символы (только base58)')
      return false
    }
    if (totalLen > 32) {
      setValidationError('Суммарная длина префикса и суффикса не должна превышать 32 символа')
      return false
    }
    setValidationError(null)
    return true
  }

  function handleStart() {
    if (!validate()) return
    onStart({ prefix, suffix, caseSensitive, batchSize: 50_000 })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prefix">Префикс адреса</Label>
          <Input
            id="prefix"
            placeholder="напр. Sol"
            value={prefix}
            onChange={e => setPrefix(e.target.value)}
            disabled={isSearching}
            maxLength={10}
            className="font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="suffix">Суффикс адреса</Label>
          <Input
            id="suffix"
            placeholder="напр. pump"
            value={suffix}
            onChange={e => setSuffix(e.target.value)}
            disabled={isSearching}
            maxLength={10}
            className="font-mono"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Switch
            id="case-sensitive"
            checked={caseSensitive}
            onCheckedChange={setCaseSensitive}
            disabled={isSearching}
          />
          <Label htmlFor="case-sensitive" className="cursor-pointer">
            Учитывать регистр
          </Label>
        </div>
        {difficulty && (
          <Badge variant={difficulty.variant}>
            {difficulty.label}
          </Badge>
        )}
      </div>

      {validationError && (
        <Alert variant="destructive">
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}

      <Alert>
        <AlertDescription className="text-xs text-muted-foreground">
          Все операции выполняются в браузере. Приватный ключ никогда не покидает ваше устройство.
        </AlertDescription>
      </Alert>

      {isSearching ? (
        <Button variant="destructive" className="w-full" onClick={onStop}>
          Остановить поиск
        </Button>
      ) : (
        <Button className="w-full" onClick={handleStart}>
          Начать поиск
        </Button>
      )}
    </div>
  )
}
