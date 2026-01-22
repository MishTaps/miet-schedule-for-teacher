import { Button, Divider, Typography } from 'antd'
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
    <div>
      <Typography.Title level={5} style={{ padding: '0 30px', textAlign: 'center' }}>
        Всего найдено групп: {groups.length}
      </Typography.Title>
      <Divider>Получение данных</Divider>
      <div style={{ padding: '0 30px', margin: '0 auto', maxWidth: '400px' }}>
        <Button
          type="primary"
          block
          loading={scanningGroupsSchedule}
          onClick={() => loadAllSchedules(groups)}
          icon={<SearchOutlined />}
          style={{ width: '100%' }}
        >
          Получить данные о расписании групп
        </Button>
      </div>
    </div>
  )
}
