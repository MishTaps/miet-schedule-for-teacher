import { Alert, Button } from 'antd'

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

interface LoadGroupsAlert {
  errorScannedGroups: string[]
  scanningGroupsSchedule: boolean
  loadAllSchedules: (value: string[]) => void
}

export const LoadGroupsAlert: React.FC<LoadGroupsAlert> = ({
  errorScannedGroups,
  scanningGroupsSchedule,
  loadAllSchedules,
}) => {
  const errorTextEnding = getPlural(errorScannedGroups.length)

  return (
    <Alert
      title={`Не удалось загрузить расписание ${errorScannedGroups.length} ${errorTextEnding}`}
      banner
      action={
        <Button
          loading={scanningGroupsSchedule}
          size="small"
          onClick={() => loadAllSchedules(errorScannedGroups)}
        >
          Повторить попытку
        </Button>
      }
    />
  )
}
