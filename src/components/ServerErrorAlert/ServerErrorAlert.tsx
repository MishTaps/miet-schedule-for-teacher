import { Result } from 'antd'
import { useTranslation } from 'react-i18next'

export const ServerErrorAlert = () => {
  const { t } = useTranslation()

  return <Result status="500" title={t('serverError.title')} subTitle={t('serverError.subTitle')} />
}
