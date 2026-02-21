import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Separator } from '~/components/ui/separator'
import { toast } from 'sonner'
import type { SolanaKeypair } from '~/entities/solana-keypair/types'

interface Props {
  result: SolanaKeypair
  checked: number
}

function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text).then(() => {
    toast.success(`${label} скопирован`)
  })
}

function formatNumber(n: number): string {
  return n.toLocaleString('ru-RU')
}

export function VanitySearchResult({ result, checked }: Props) {
  const [secretVisible, setSecretVisible] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Адрес найден</Badge>
        {checked > 0 && (
          <span className="text-xs text-muted-foreground">
            проверено {formatNumber(checked)} адресов
          </span>
        )}
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Адрес</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm font-mono bg-muted px-3 py-2 rounded-md break-all">
              {result.address}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(result.address, 'Адрес')}
            >
              Копировать
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Публичный ключ</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm font-mono bg-muted px-3 py-2 rounded-md break-all">
              {result.publicKey}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(result.publicKey, 'Публичный ключ')}
            >
              Копировать
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Приватный ключ (base58)
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm font-mono bg-muted px-3 py-2 rounded-md break-all">
              {secretVisible ? result.secretKey : '•'.repeat(32)}
            </code>
            <div className="flex flex-col gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSecretVisible(v => !v)}
              >
                {secretVisible ? 'Скрыть' : 'Показать'}
              </Button>
              {secretVisible && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(result.secretKey, 'Приватный ключ')}
                >
                  Копировать
                </Button>
              )}
            </div>
          </div>
          <p className="text-xs text-destructive">
            Никогда не делитесь приватным ключом. Сохраните его в надёжном месте.
          </p>
        </div>
      </div>
    </div>
  )
}
