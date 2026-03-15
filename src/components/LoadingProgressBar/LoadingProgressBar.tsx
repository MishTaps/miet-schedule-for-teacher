import { Progress } from 'antd'
interface LoadingProgressBar {
  groupScannedPercent: number
  scanningGroupsSchedule: boolean
}

export const LoadingProgressBar: React.FC<LoadingProgressBar> = ({
  groupScannedPercent,
  scanningGroupsSchedule,
}) => {
  return (
    <>
      <div style={{ padding: '0 30px 20px', textAlign: 'center' }}>
        <Progress
          percent={groupScannedPercent}
          status={scanningGroupsSchedule ? 'active' : 'exception'}
          percentPosition={{ align: 'center' }}
          style={{ padding: '5px 0' }}
        />
      </div>
    </>
  )
}
