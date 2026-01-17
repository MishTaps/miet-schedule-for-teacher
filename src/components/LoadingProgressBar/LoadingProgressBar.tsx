import { Divider, Progress } from 'antd'

interface LoadingProgressBar {
  groupScannedPercent: number
}

export const LoadingProgressBar: React.FC<LoadingProgressBar> = ({ groupScannedPercent }) => {
  return (
    <>
      <Divider>Загрузка расписания...</Divider>
      <Progress
        percent={groupScannedPercent}
        status="active"
        percentPosition={{ align: 'center' }}
        style={{ padding: '0 30px 20px' }}
      />
    </>
  )
}
