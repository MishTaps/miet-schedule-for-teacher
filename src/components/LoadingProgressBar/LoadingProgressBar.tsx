import { Progress } from 'antd'
import styles from './LoadingProgressBar.module.css'

interface LoadingProgressBar {
  groupScannedPercent: number
  scanningGroupsSchedule: boolean
}

export const LoadingProgressBar: React.FC<LoadingProgressBar> = ({
  groupScannedPercent,
  scanningGroupsSchedule,
}) => {
  return (
    <Progress
      percent={groupScannedPercent}
      status={scanningGroupsSchedule ? 'active' : 'exception'}
      percentPosition={{ align: 'center' }}
      className={styles.progressBar}
    />
  )
}
