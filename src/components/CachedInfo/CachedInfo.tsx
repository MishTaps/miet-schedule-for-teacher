import { useLoadingStore } from '@/stores'
import { Alert, Button } from 'antd'
import localforage from 'localforage'
import { useTranslation } from 'react-i18next'

export const CachedInfo = () => {
  const { t } = useTranslation()

  const updatedAt = useLoadingStore((state) => state.updatedAt)

  if (!updatedAt) return

  const diff = Date.now() - updatedAt

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
      {t('cashed.button')}
    </Button>
  )

  const day = 1000 * 60 * 60 * 24
  if (diff < day) {
    return (
      <Alert title={t('cashed.day', { formattedDate })} banner showIcon closable type="success" />
    )
  }

  const week = day * 7
  if (diff < week) {
    return (
      <Alert
        title={t('cashed.week', { formattedDate })}
        banner
        closable
        type="success"
        action={actionButton}
      />
    )
  }

  const month = day * 30
  if (diff < month) {
    return (
      <Alert
        title={t('cashed.month', { formattedDate })}
        banner
        closable
        type="warning"
        action={actionButton}
      />
    )
  }

  const halfOfYear = month * 6
  if (diff < halfOfYear) {
    return (
      <Alert
        title={t('cashed.halfOfYear', { formattedDate })}
        banner
        type="error"
        action={actionButton}
      />
    )
  }

  localforage.removeItem('schedule_cache')
  return
}
