import { Spin } from 'antd'
import { useEffect, useMemo } from 'react'

import { defaultTableData } from './tableConfig/defaultTableData'

import {
  CachedInfo,
  ExportSchedule,
  GetScheduleButton,
  LoadGroupsAlert,
  MainForm,
  ScheduleTable,
  ServerErrorAlert,
} from '@/components'
import { GroupsService } from '@/data'
import {
  useLessonsStore,
  useLoadingStore,
  useTeachersStore,
  useVisualSettingsStore,
} from '@/stores'
import { buildScheduleForTeacher } from '@/utils'
import { useLoadCache } from '@/hooks'

export const MainWorkplace = () => {
  const hideTimeColumn = useVisualSettingsStore((state) => state.hideTimeColumn)

  const lessons = useLessonsStore((state) => state.lessons)
  const timeCodes = useLessonsStore((state) => state.timeCodes)
  const timeRanges = useLessonsStore((state) => state.timeRanges)

  const selectedTeacher = useTeachersStore((state) => state.selectedTeacher)

  const isGroupsScanned = useLoadingStore((state) => state.isGroupsScanned)
  const isGetGroupsError = useLoadingStore((state) => state.isGetGroupsError)
  const isGetGroups = useLoadingStore((state) => state.isGetGroups)
  const setGroups = useLoadingStore((state) => state.setGroups)
  const setIsGetGroups = useLoadingStore((state) => state.setIsGetGroups)
  const setIsGetGroupsError = useLoadingStore((state) => state.setIsGetGroupsError)

  const tableData = useMemo(() => {
    if (!selectedTeacher) return defaultTableData

    return buildScheduleForTeacher({
      lessons,
      selectedTeacher,
      hideTimeColumn,
      timeRanges,
      timeCodes,
    })
  }, [hideTimeColumn, lessons, selectedTeacher, timeCodes, timeRanges])

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groupsData = await GroupsService.getGroups()
        setGroups(groupsData)
      } catch {
        setIsGetGroupsError(true)
      } finally {
        setIsGetGroups(false)
      }
    }

    if (isGroupsScanned === false) {
      fetchGroups()
    }
  }, [isGroupsScanned, setGroups, setIsGetGroups, setIsGetGroupsError])

  const { loadScheduleCache, loadPersonalDataCache } = useLoadCache()

  useEffect(() => {
    loadScheduleCache()
    loadPersonalDataCache()
  }, [loadPersonalDataCache, loadScheduleCache])

  if (isGetGroupsError) {
    return <ServerErrorAlert />
  }

  if (!isGroupsScanned) {
    return (
      <Spin spinning={isGetGroups} tip="Загрузка...">
        <GetScheduleButton />
      </Spin>
    )
  }

  return (
    <>
      <CachedInfo />
      <LoadGroupsAlert />
      <MainForm />
      {selectedTeacher && (
        <>
          <ScheduleTable tableData={tableData} />
          <ExportSchedule tableData={tableData} />
        </>
      )}
    </>
  )
}
