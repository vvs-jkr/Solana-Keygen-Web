import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { Button } from '~/components/ui/button'
import { useVanitySearch } from '~/features/vanity-search/model/useVanitySearch'
import { VanitySearchForm } from '~/features/vanity-search/ui/VanitySearchForm'
import { VanitySearchResult } from '~/features/vanity-search/ui/VanitySearchResult'
import { useTheme } from '~/shared/lib/useTheme'

function formatNumber(n: number): string {
  return n.toLocaleString('ru-RU')
}

export function VanityPage() {
  const { state, start, stop, reset } = useVanitySearch()
  const { theme, toggle } = useTheme()
  const isSearching = state.status === 'searching'

  return (
    <div className="min-h-screen bg-background flex items-start justify-center p-6 pt-12">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="fixed top-4 right-4"
        aria-label="Переключить тему"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </Button>

      <div className="w-full max-w-xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Solana Vanity Address</h1>
          <p className="text-muted-foreground">
            Генерация адресов с нужным префиксом или суффиксом прямо в браузере
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Параметры поиска</CardTitle>
            <CardDescription>
              Адрес Solana — base58 строка длиной 32–44 символа
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VanitySearchForm isSearching={isSearching} onStart={start} onStop={stop} />
          </CardContent>
        </Card>

        {isSearching && (
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Поиск...</span>
                <span className="font-mono">{formatNumber(state.checked)} проверено</span>
              </div>
              <Progress value={undefined} className="animate-pulse" />
            </CardContent>
          </Card>
        )}

        {state.status === 'stopped' && !state.result && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Поиск остановлен. Проверено {formatNumber(state.checked)} адресов.
            </CardContent>
          </Card>
        )}

        {state.result && (
          <Card>
            <CardHeader>
              <CardTitle>Результат</CardTitle>
            </CardHeader>
            <CardContent>
              <VanitySearchResult result={state.result} checked={state.checked} />
              <div className="mt-4">
                <button
                  onClick={reset}
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                >
                  Начать новый поиск
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {state.error && (
          <Card className="border-destructive">
            <CardContent className="pt-6 text-destructive text-sm">
              Ошибка: {state.error}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
