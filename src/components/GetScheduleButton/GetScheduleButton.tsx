import { Button, Divider, Row, Col } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { LoadingProgressBar } from '../LoadingProgressBar'
import styles from './GetScheduleButton.module.css'

interface GetScheduleButton {
  groups: string[]
  scanningGroupsSchedule: boolean
  groupScannedPercent: number
  loadAllSchedules: (value: string[]) => void
}

export const GetScheduleButton: React.FC<GetScheduleButton> = ({
  groups,
  scanningGroupsSchedule,
  loadAllSchedules,
  groupScannedPercent,
}) => {
  return (
    <>
      <Row justify="center" align="middle" className={styles.body}>
        <Col className={styles.button}>
          <Divider>Получение данных с сервера</Divider>
          <Button
            type="primary"
            block
            loading={scanningGroupsSchedule}
            onClick={() => loadAllSchedules(groups)}
            icon={<SearchOutlined />}
          >
            Получить расписание занятий
          </Button>
        </Col>
      </Row>
      {scanningGroupsSchedule && (
        <LoadingProgressBar
          groupScannedPercent={groupScannedPercent}
          scanningGroupsSchedule={scanningGroupsSchedule}
        />
      )}
    </>
  )
}
