import { Spin } from 'antd'
import { useMemo } from 'react'

import { getDefaultTableData } from './tableConfig/defaultTableData'

import {
  CachedInfo,
  ExportSchedule,
  GetScheduleButton,
  LoadGroupsAlert,
  MainForm,
  ScheduleTable,
  ServerErrorAlert,
} from '@/components'
import {
  useLessonsStore,
  useLoadingStore,
  useTeachersStore,
  useVisualSettingsStore,
} from '@/stores'
import { buildTableForTeacher } from '@/utils'
import { useFetchGroups, useLoadCache } from '@/hooks'
import { useTranslation } from 'react-i18next'

export const MainWorkplace = () => {
  const { t } = useTranslation()

  const hideTimeColumn = useVisualSettingsStore((state) => state.hideTimeColumn)

  const lessons = useLessonsStore((state) => state.lessons)
  const timeCodes = useLessonsStore((state) => state.timeCodes)
  const timeRanges = useLessonsStore((state) => state.timeRanges)

  const teachers = useTeachersStore((state) => state.teachers)
  const selectedTeacher = useTeachersStore((state) => state.selectedTeacher)

  const isGroupsScanned = useLoadingStore((state) => state.isGroupsScanned)
  const isGetGroupsError = useLoadingStore((state) => state.isGetGroupsError)
  const isGetGroups = useLoadingStore((state) => state.isGetGroups)

  const isTeacherAvailable = selectedTeacher && teachers.includes(selectedTeacher)

  const tableData = useMemo(() => {
    if (!selectedTeacher) return getDefaultTableData()

    return buildTableForTeacher({
      lessons,
      selectedTeacher,
      hideTimeColumn,
      timeRanges,
      timeCodes,
    })
  }, [hideTimeColumn, lessons, selectedTeacher, timeCodes, timeRanges])

  useFetchGroups()
  useLoadCache()

  if (isGetGroupsError) {
    return <ServerErrorAlert />
  }

  if (!isGroupsScanned) {
    return (
      <Spin spinning={isGetGroups} tip={t('loading')}>
        <GetScheduleButton />
      </Spin>
    )
  }

  return (
    <>
      <CachedInfo />
      <LoadGroupsAlert />
      <MainForm />
      {selectedTeacher && <ScheduleTable tableData={tableData} />}
      {isTeacherAvailable && <ExportSchedule tableData={tableData} />}
    </>
  )
}
