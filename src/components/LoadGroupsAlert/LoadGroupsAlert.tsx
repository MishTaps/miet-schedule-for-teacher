import { Alert, Button } from 'antd'
import { LoadingProgressBar } from '../LoadingProgressBar'
import { useLoadingStore } from '@/stores'
import { useScanGroups } from '@/hooks'

const pr = new Intl.PluralRules('ru-RU')
function getPlural(count: number) {
  const rule = pr.select(count)
  const forms: Partial<Record<Intl.LDMLPluralRule, string>> = {
    one: 'группы',
    few: 'групп',
    many: 'групп',
  }
  return forms[rule] || forms.many
}

export const LoadGroupsAlert = () => {
  const { loadAllSchedules } = useScanGroups()

  const isScanningGroups = useLoadingStore((state) => state.isScanningGroups)
  const errorScannedGroups = useLoadingStore((state) => state.errorScannedGroups)

  if (!errorScannedGroups.length) return

  const errorTextEnding = getPlural(errorScannedGroups.length)

  return (
    <>
      <Alert
        title={`Не удалось загрузить расписание ${errorScannedGroups.length} ${errorTextEnding}. Расписание преподавателя может быть неполное`}
        banner
        action={
          <Button
            loading={isScanningGroups}
            size="small"
            onClick={() => loadAllSchedules(errorScannedGroups)}
          >
            Повторить попытку
          </Button>
        }
      />
      <LoadingProgressBar />
    </>
  )
}
