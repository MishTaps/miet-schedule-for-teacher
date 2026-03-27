import { Button, Divider, Row, Col } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

interface GroupFound {
  groups: string[]
  scanningGroupsSchedule: boolean
  loadAllSchedules: (value: string[]) => void
}

export const GroupFound: React.FC<GroupFound> = ({
  groups,
  scanningGroupsSchedule,
  loadAllSchedules,
}) => {
  return (
    <Row justify="center" align="middle" style={{ height: '50vh' }}>
      <Col style={{ width: '100%', maxWidth: 300 }}>
        <Divider>Получение данных с сервера</Divider>
        <Button
          type="primary"
          block
          loading={scanningGroupsSchedule}
          onClick={() => loadAllSchedules(groups)}
          icon={<SearchOutlined />}
          style={{ width: '100%' }}
        >
          Получить расписание занятий
        </Button>
      </Col>
    </Row>
  )
}
