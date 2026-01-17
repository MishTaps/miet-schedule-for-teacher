import { Typography } from 'antd'

interface GroupFound {
  groups: string[]
}

export const GroupFound: React.FC<GroupFound> = ({ groups }) => {
  return (
    <Typography.Title level={5} style={{ padding: '0 30px', textAlign: 'center' }}>
      Всего найдено групп: {groups.length}
    </Typography.Title>
  )
}
