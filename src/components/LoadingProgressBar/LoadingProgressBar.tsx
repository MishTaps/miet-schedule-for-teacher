import { Progress } from 'antd'
import styles from './LoadingProgressBar.module.css'
import { useLoadingStore } from '@/stores'

export const LoadingProgressBar = () => {
  const groups = useLoadingStore((state) => state.groups)
  const scannedGroupsCount = useLoadingStore((state) => state.scannedGroupsCount)
  const isScanningGroups = useLoadingStore((state) => state.isScanningGroups)

  const scannedGroupsPercent = Math.round((scannedGroupsCount / (groups.length || 1)) * 100)

  return (
    <Progress
      percent={scannedGroupsPercent}
      status={isScanningGroups ? 'active' : 'exception'}
      percentPosition={{ align: 'center' }}
      className={styles.progressBar}
    />
  )
}
