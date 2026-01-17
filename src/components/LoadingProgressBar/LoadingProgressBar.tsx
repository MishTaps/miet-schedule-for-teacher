import { Divider, Progress } from 'antd'

interface LoadingProgressBar {
  groupScannedPercent: number
}

export const LoadingProgressBar: React.FC<LoadingProgressBar> = ({ groupScannedPercent }) => {
  return (
    <>
      <Divider>Загрузка расписания...</Divider>
      <div style={{ textAlign: 'center' }}>
        А пока можете ознакомиться с расширенными настройками.
      </div>
      <Progress
        percent={groupScannedPercent}
        status="active"
        percentPosition={{ align: 'center' }}
        style={{ padding: '0 0 20px 0' }}
      />
    </>
  )
}
