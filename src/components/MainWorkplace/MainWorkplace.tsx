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
import type { ScheduleDataItem, ScheduleRecord, WeekTypes } from '@/types'
import { useLoadingStore, useTeachersStore, useVisualSettingsStore } from '@/stores'

export const MainWorkplace = () => {
  const hideTimeColumn = useVisualSettingsStore((state) => state.hideTimeColumn)

  const groups = useLoadingStore((state) => state.groups)
  const errorScannedGroups = useLoadingStore((state) => state.errorScannedGroups)
  const scannedGroupsCount = useLoadingStore((state) => state.scannedGroupsCount)
  const isGroupsScanned = useLoadingStore((state) => state.isGroupsScanned)
  const isGetGroupsError = useLoadingStore((state) => state.isGetGroupsError)
  const isGetGroups = useLoadingStore((state) => state.isGetGroups)
  const setIsScanningGroups = useLoadingStore((state) => state.setIsScanningGroups)
  const setScannedGroupsCount = useLoadingStore((state) => state.setScannedGroupsCount)
  const setErrorScannedGroups = useLoadingStore((state) => state.setErrorScannedGroups)
  const setIsGroupsScanned = useLoadingStore((state) => state.setIsGroupsScanned)
  const setGroups = useLoadingStore((state) => state.setGroups)
  const setIsGetGroups = useLoadingStore((state) => state.setIsGetGroups)
  const setIsGetGroupsError = useLoadingStore((state) => state.setIsGetGroupsError)
  const setUpdatedAt = useLoadingStore((state) => state.setUpdatedAt)

  const teachers = useTeachersStore((state) => state.teachers)
  const selectedTeacher = useTeachersStore((state) => state.selectedTeacher)
  const setTeachers = useTeachersStore((state) => state.setTeachers)
  const setFavoriteTeachers = useTeachersStore((state) => state.setFavoriteTeachers)

  const [lessons, setLessons] = useState<ScheduleDataItem[]>([])
  const [timeCodes, setTimeCodes] = useState<number[]>([])
  const [timeRanges, setTimeRanges] = useState<string[]>([])

  const tableData = useMemo(() => {
    if (!selectedTeacher) return defaultTableData

    const buildScheduleForTeacher = () => {
      const updatedData: ScheduleRecord[] = structuredClone(defaultTableData)

      lessons
        .filter((l) => l.Class?.TeacherFull === selectedTeacher)
        .forEach((lesson) => {
          const timeIndex = lesson.Time.Code - 1
          const dayKey = `day${lesson.Day}`
          const weekKey = `weekType${lesson.DayNumber}` as keyof WeekTypes

          if (!updatedData[timeIndex]) return

          const currentRow = updatedData[timeIndex]
          const currentDay = (currentRow[dayKey] as WeekTypes) ?? {
            weekType0: '',
            weekType1: '',
            weekType2: '',
            weekType3: '',
          }

          const newGroup = lesson.Group.Name
          const newClass = lesson.Class.Name
          const newRoom = lesson.Room.Name

          let mergedInfo = ''
          const existingInfo = currentDay[weekKey]
          if (existingInfo) {
            const existingInfoWithoutTime = existingInfo.startsWith(
              `${timeCodes[lesson.Time.Code - 1]} пара`,
            )
              ? existingInfo.split('\n').slice(2).join('\n')
              : existingInfo

            const blocks = existingInfoWithoutTime.split('\n---\n')
            let isFoundMatch = false

            const updatedBlocks = blocks.map((block) => {
              const lines = block.split('\n')
              const blockGroups = lines[0]
              const blockClass = lines[1]
              const blockRoom = lines[2]

              if (blockClass === newClass && blockRoom === newRoom) {
                isFoundMatch = true
                const groupsArray = blockGroups.split(',').map((g) => g.trim())

                if (!groupsArray.includes(newGroup)) {
                  groupsArray.push(newGroup)
                  groupsArray.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
                }

                return `${groupsArray.join(', ')}\n${blockClass}\n${blockRoom}`
              }
              return block
            })

            if (!isFoundMatch) {
              updatedBlocks.push(`${newGroup}\n${newClass}\n${newRoom}`)
            }

            mergedInfo = updatedBlocks.join('\n---\n')
          } else {
            mergedInfo = `${newGroup}\n${newClass}\n${newRoom}`
          }

          if (hideTimeColumn && !mergedInfo.startsWith(`${timeCodes[lesson.Time.Code - 1]} пара`)) {
            const timeName = `${timeCodes[lesson.Time.Code - 1]} пара`
            const timeRange = timeRanges[lesson.Time.Code - 1]

            const mergedTimeRange = timeRange
              .split(' - ')
              .map((str) => {
                const date = new Date(str)
                return date.toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              })
              .join(' - ')
            mergedInfo = `${timeName}\n${mergedTimeRange}\n${mergedInfo}`
          }

          updatedData[timeIndex] = {
            ...currentRow,
            [dayKey]: {
              ...currentDay,
              [weekKey]: mergedInfo,
            },
          }
        })

      return updatedData
    }

    return buildScheduleForTeacher()
  }, [hideTimeColumn, lessons, selectedTeacher, timeCodes, timeRanges])

  const loadAllSchedules = async (groupsToLoad = groups) => {
    let localErrorGroups = [...errorScannedGroups]
    let localScannedGroups = scannedGroupsCount
    const localTimeCodes: number[] = timeCodes
    const localTimeRanges: string[] = timeRanges

    setIsScanningGroups(true)
    if (errorScannedGroups.length == 0) {
      setScannedGroupsCount(0)
      localScannedGroups = 0
    } else {
      setScannedGroupsCount(groups.length - errorScannedGroups.length)
      localScannedGroups = groups.length - errorScannedGroups.length
    }

    const BATCH_SIZE = 10
    const loadedLessons = [...lessons]
    const teachersSet = new Set(teachers)

    for (let i = 0; i < groupsToLoad.length; i += BATCH_SIZE) {
      const batch = groupsToLoad.slice(i, i + BATCH_SIZE)

      await Promise.all(
        batch.map(async (group) => {
          try {
            const res = await GroupsService.getScheduleForGroup(group)
            localScannedGroups += 1
            setScannedGroupsCount(localScannedGroups)

            if (!res?.Data) return

            res.Data.forEach((lesson) => {
              loadedLessons.push(lesson)

              if (lesson.Class?.TeacherFull) {
                teachersSet.add(lesson.Class.TeacherFull)
              }
            })

            if (errorScannedGroups.includes(group)) {
              localErrorGroups = localErrorGroups.filter((item) => item !== group)
            }
            if (i == 0) {
              res.Times.forEach((time) => {
                localTimeCodes.push(time.Code)
                localTimeRanges.push(`${time.TimeFrom} - ${time.TimeTo}`)
              })
            }
          } catch {
            localErrorGroups.push(group)
          }
        }),
      )
    }

    const localUpdatedAt = Date.now()
    setLessons(loadedLessons)
    setTeachers(Array.from(teachersSet).sort())
    setErrorScannedGroups(localErrorGroups)
    setScannedGroupsCount(localScannedGroups)
    setTimeCodes(localTimeCodes)
    setTimeRanges(localTimeRanges)
    setUpdatedAt(localUpdatedAt)

    await localforage.setItem('schedule_cache', {
      allLessons: loadedLessons,
      teachers: Array.from(teachersSet).sort(),
      scannedGroups: localScannedGroups,
      errorScannedGroups: localErrorGroups,
      groups: groups,
      timeCodes: localTimeCodes,
      timeRanges: localTimeRanges,
      cachedAt: localUpdatedAt,
    })

    setIsScanningGroups(false)
    setIsGroupsScanned(true)
  }

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
