import { Button, Divider, Row, Col } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import styles from './GetScheduleButton.module.css'
import { useLoadingStore } from '@/stores'
import { useScanGroups } from '@/hooks'
import { LoadingProgressBar } from '@/components'
import { useTranslation } from 'react-i18next'

export const GetScheduleButton = () => {
  const { t } = useTranslation()

  const { loadAllSchedules } = useScanGroups()

  const groups = useLoadingStore((state) => state.groups)
  const isScanningGroups = useLoadingStore((state) => state.isScanningGroups)

  return (
    <>
      <Row justify="center" align="middle" className={styles.body}>
        <Col className={styles.button}>
          <Divider>{t('getSchedule.header')}</Divider>
          <Button
            type="primary"
            block
            loading={isScanningGroups}
            onClick={() => loadAllSchedules(groups)}
            icon={<SearchOutlined />}
          >
            {t('getSchedule.button')}
          </Button>
        </Col>
      </Row>
      {isScanningGroups && <LoadingProgressBar />}
    </>
  )
}
