import { Alert, Button } from 'antd'
import { useLoadingStore } from '@/stores'
import { useScanGroups } from '@/hooks'
import { LoadingProgressBar } from '@/components'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  const { loadAllSchedules } = useScanGroups()

  const isScanningGroups = useLoadingStore((state) => state.isScanningGroups)
  const errorScannedGroups = useLoadingStore((state) => state.errorScannedGroups)

  const errorScannedGroupsCount = errorScannedGroups.length

  if (!errorScannedGroupsCount) return

  const errorTextEnding = getPlural(errorScannedGroupsCount)

  return (
    <>
      <Alert
        title={t('loadGroupsAlert.title', { errorScannedGroupsCount, errorTextEnding })}
        banner
        action={
          <Button
            loading={isScanningGroups}
            size="small"
            onClick={() => loadAllSchedules(errorScannedGroups)}
          >
            {t('loadGroupsAlert.button')}
          </Button>
        }
      />
      <LoadingProgressBar />
    </>
  )
}
