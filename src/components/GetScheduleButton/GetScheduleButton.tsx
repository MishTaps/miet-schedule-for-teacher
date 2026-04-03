import { Button, Divider, Row, Col } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { LoadingProgressBar } from '../LoadingProgressBar'
import styles from './GetScheduleButton.module.css'
import { useLoadingStore } from '@/stores'

interface GetScheduleButton {
  loadAllSchedules: (value: string[]) => void
}

export const GetScheduleButton: React.FC<GetScheduleButton> = ({ loadAllSchedules }) => {
  const groups = useLoadingStore((state) => state.groups)
  const isScanningGroups = useLoadingStore((state) => state.isScanningGroups)

  return (
    <>
      <Row justify="center" align="middle" className={styles.body}>
        <Col className={styles.button}>
          <Divider>Получение данных с сервера</Divider>
          <Button
            type="primary"
            block
            loading={isScanningGroups}
            onClick={() => loadAllSchedules(groups)}
            icon={<SearchOutlined />}
          >
            Получить расписание занятий
          </Button>
        </Col>
      </Row>
      {isScanningGroups && <LoadingProgressBar />}
    </>
  )
}
