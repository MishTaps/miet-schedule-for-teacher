import { Spin } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import localforage from 'localforage'

import { defaultTableData } from './tableConfig/defaultTableData'

import {
  CashedInfo,
  ExportSchedule,
  GetScheduleButton,
  LoadGroupsAlert,
  MainForm,
  ScheduleTable,
  ServerErrorAlert,
} from '@/components'
import { GroupsService } from '@/data'
import type { ScheduleDataItem } from '@/types'
import { useLoadingStore, useTeachersStore, useVisualSettingsStore } from '@/stores'
import { buildScheduleForTeacher } from '@/utils'
import { useScanGroups } from '@/hooks'

export const MainWorkplace = () => {
  const hideTimeColumn = useVisualSettingsStore((state) => state.hideTimeColumn)

  const isGroupsScanned = useLoadingStore((state) => state.isGroupsScanned)
  const isGetGroupsError = useLoadingStore((state) => state.isGetGroupsError)
  const isGetGroups = useLoadingStore((state) => state.isGetGroups)
  const setScannedGroupsCount = useLoadingStore((state) => state.setScannedGroupsCount)
  const setErrorScannedGroups = useLoadingStore((state) => state.setErrorScannedGroups)
  const setIsGroupsScanned = useLoadingStore((state) => state.setIsGroupsScanned)
  const setGroups = useLoadingStore((state) => state.setGroups)
  const setIsGetGroups = useLoadingStore((state) => state.setIsGetGroups)
  const setIsGetGroupsError = useLoadingStore((state) => state.setIsGetGroupsError)
  const setUpdatedAt = useLoadingStore((state) => state.setUpdatedAt)

  const selectedTeacher = useTeachersStore((state) => state.selectedTeacher)
  const setTeachers = useTeachersStore((state) => state.setTeachers)
  const setFavoriteTeachers = useTeachersStore((state) => state.setFavoriteTeachers)

  const [lessons, setLessons] = useState<ScheduleDataItem[]>([])
  const [timeCodes, setTimeCodes] = useState<number[]>([])
  const [timeRanges, setTimeRanges] = useState<string[]>([])

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

  const { loadAllSchedules } = useScanGroups({
    lessons,
    setLessons,
    timeCodes,
    setTimeCodes,
    timeRanges,
    setTimeRanges,
  })

  const fetchGroups = useCallback(async () => {
    try {
      const groupsData = await GroupsService.getGroups()
      setGroups(groupsData)
    } catch {
      setIsGetGroupsError(true)
    } finally {
      setIsGetGroups(false)
    }
  }, [setGroups, setIsGetGroups, setIsGetGroupsError])

  useEffect(() => {
    if (isGroupsScanned === false) {
      fetchGroups()
    }
  }, [fetchGroups, isGroupsScanned])

  const loadScheduleCache = useCallback(async () => {
    try {
      const cached = (await localforage.getItem('schedule_cache')) as {
        allLessons: ScheduleDataItem[]
        teachers: string[]
        groups: string[]
        timeCodes: number[]
        timeRanges: string[]
        scannedGroups: number
        errorScannedGroups: string[]
        cachedAt: number
        favoriteTeachers?: string[]
      } | null
      if (cached) {
        setUpdatedAt(cached.cachedAt)
        setLessons(cached.allLessons)
        setTeachers(cached.teachers)
        setGroups(cached.groups)
        setScannedGroupsCount(cached.scannedGroups)
        setErrorScannedGroups(cached.errorScannedGroups)
        setIsGroupsScanned(true)
        setIsGetGroups(false)
        setTimeCodes(cached.timeCodes)
        setTimeRanges(cached.timeRanges)
      } else {
        setIsGroupsScanned(false)
      }
    } catch (e) {
      console.error('Ошибка чтения schedule_cache в кэше', e)
    }
  }, [
    setErrorScannedGroups,
    setGroups,
    setIsGetGroups,
    setIsGroupsScanned,
    setScannedGroupsCount,
    setTeachers,
    setUpdatedAt,
  ])

  const loadPersonalDataCache = useCallback(async () => {
    try {
      const cached = (await localforage.getItem('personal_data')) as {
        favoriteTeachers: string[]
      } | null
      if (cached) {
        setFavoriteTeachers(cached.favoriteTeachers)
      }
    } catch (e) {
      console.error('Ошибка чтения personal_data в кэше', e)
    }
  }, [setFavoriteTeachers])

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
        <GetScheduleButton loadAllSchedules={loadAllSchedules} />
      </Spin>
    )
  }

  return (
    <>
      <CashedInfo />
      <LoadGroupsAlert loadAllSchedules={loadAllSchedules} />
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
