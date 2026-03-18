import { Alert, Button } from 'antd'
import localforage from 'localforage'

interface CashedInfo {
  timeCashed?: number
  setFavoriteTeachers: (value: string[]) => void
}

export const CashedInfo: React.FC<CashedInfo> = ({ timeCashed }) => {
  if (!timeCashed) {
    return
  }

  const formattedDate = new Date(timeCashed).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const resetSchedule = () => {
    localforage.removeItem('schedule_cache')
    location.reload()
  }

  const actionButton = (
    <Button size="small" onClick={resetSchedule}>
      Загрузить заново
    </Button>
  )

  const day = 1000 * 60 * 60 * 24
  if (Date.now() - timeCashed < day) {
    return (
      <Alert
        title={`Расписание загружено ${formattedDate}`}
        banner
        showIcon
        closable
        type="success"
      />
    )
  }

  const week = day * 7
  if (Date.now() - timeCashed < week) {
    return (
      <Alert
        title={`Расписание загружено более суток назад: ${formattedDate}`}
        banner
        closable
        type="success"
        action={actionButton}
      />
    )
  }

  const month = day * 30
  if (Date.now() - timeCashed < month) {
    return (
      <Alert
        title={`Расписание загружено более недели назад: ${formattedDate}`}
        banner
        closable
        type="warning"
        action={actionButton}
      />
    )
  }

  const halfOfYear = month * 6
  if (Date.now() - timeCashed < halfOfYear) {
    return (
      <Alert
        title={`Расписание загружено более месяца назад: ${formattedDate}`}
        banner
        type="error"
        action={actionButton}
      />
    )
  }

  localforage.removeItem('schedule_cache')
  return
}
