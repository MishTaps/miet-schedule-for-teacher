import { useLoadingStore } from '@/stores'
import { Alert, Button } from 'antd'
import localforage from 'localforage'

export const CachedInfo = () => {
  const updatedAt = useLoadingStore((state) => state.updatedAt)

  if (!updatedAt) return

  const formattedDate = new Date(updatedAt).toLocaleDateString('ru-RU', {
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
  if (Date.now() - updatedAt < day) {
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
  if (Date.now() - updatedAt < week) {
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
  if (Date.now() - updatedAt < month) {
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
  if (Date.now() - updatedAt < halfOfYear) {
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
