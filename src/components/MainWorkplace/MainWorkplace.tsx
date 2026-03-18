import { message, Spin } from 'antd'
import { useEffect, useState } from 'react'
import localforage from 'localforage'

import './MainWorkplace.css'

import { defaultTableData } from './tableConfig/defaultTableData'

import {
  CashedInfo,
  ExportSchedule,
  GroupFound,
  LoadGroupsAlert,
  LoadingProgressBar,
  MainForm,
  ScheduleTable,
  ServerErrorAlert,
} from '@/components'
import { GroupsService } from '@/data'
import type {
  ScheduleDataItem,
  ScheduleRecord,
  SelectedDayOfWeekType,
  SelectedWeekType,
  SortColumnType,
  WeekTypes,
} from '@/types'

interface MainWorkplaceProps {
  isOpenedOnFreeServer: boolean
}

export const MainWorkplace: React.FC<MainWorkplaceProps> = ({ isOpenedOnFreeServer }) => {
  const params = new URLSearchParams(window.location.search)
  const paramTeacher = params.get('teacher')

  const [groups, setGroups] = useState<string[]>([])
  const [loadingGroups, setLoadingGroups] = useState(true)
  const [finishedFirstGroupsLoading, setFinishedFirstGroupsLoading] = useState(false)
  const [isGroupsLoadedWithError, setIsGroupsLoadedWithError] = useState(false)
  const [scanningGroupsSchedule, setScanningAGroupsSchedule] = useState(false)

  const [scannedGroups, setScannedGroups] = useState(0)
  const groupScannedPercent = Math.round((scannedGroups / (groups.length || 1)) * 100)
  const [errorScannedGroups, setErrorScannedGroups] = useState<string[]>([])

  const [allLessons, setAllLessons] = useState<ScheduleDataItem[]>([])
  const [teachers, setTeachers] = useState<string[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(paramTeacher ?? null)
  const [favoriteTeachers, setFavoriteTeachers] = useState<string[]>([])
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<SelectedDayOfWeekType>('allDays')
  const [selectedWeekType, setSelectedWeekType] = useState<SelectedWeekType>('allWeekTypes')

  const [tableData, setTableData] = useState<ScheduleRecord[]>(defaultTableData)
  const [sortColumnType, setSortColumnType] = useState<SortColumnType>('day')
  const [hideEmptyDaysTypes, setHideEmptyDaysTypes] = useState(true)
  const [hideEmptyRows, setHideEmptyRows] = useState(true)
  const [hideTimeColumn, setHideTimeColumn] = useState(window.innerWidth < 576)

  const [timeCodes, setTimeCodes] = useState<number[]>([])
  const [timeRanges, setTimeRanges] = useState<string[]>([])

  const [timeCashed, setTimeCashed] = useState<number>()

  useEffect(() => {
    const loadScheduleCache = async () => {
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
          setTimeCashed(cached.cachedAt)
          setAllLessons(cached.allLessons)
          setTeachers(cached.teachers)
          setGroups(cached.groups)
          setScannedGroups(cached.scannedGroups)
          setErrorScannedGroups(cached.errorScannedGroups)
          setFinishedFirstGroupsLoading(true)
          setLoadingGroups(false)
          setTimeCodes(cached.timeCodes)
          setTimeRanges(cached.timeRanges)
        }
      } catch (e) {
        console.error('Ошибка чтения schedule_cache в кэше', e)
      }

      const fetchGroups = async () => {
        try {
          const groupsData = await GroupsService.getGroups()
          setGroups(groupsData)
        } catch {
          setIsGroupsLoadedWithError(true)
        } finally {
          setLoadingGroups(false)
        }
      }

      fetchGroups()
    }

    const loadPersonalDataCache = async () => {
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
    }

    loadScheduleCache()
    loadPersonalDataCache()
  }, [])

  const loadAllSchedules = async (groupsToLoad = groups) => {
    let localErrorGroups = [...errorScannedGroups]
    let localScannedGroups = scannedGroups
    const localTimeCodes: number[] = timeCodes
    const localTimeRanges: string[] = timeRanges

    setScanningAGroupsSchedule(true)
    if (errorScannedGroups.length == 0) {
      setScannedGroups(0)
      localScannedGroups = 0
    } else {
      setScannedGroups(groups.length - errorScannedGroups.length)
      localScannedGroups = groups.length - errorScannedGroups.length
    }

    const BATCH_SIZE = 10
    const lessons = [...allLessons]
    const teachersSet = new Set(teachers)

    for (let i = 0; i < groupsToLoad.length; i += BATCH_SIZE) {
      const batch = groupsToLoad.slice(i, i + BATCH_SIZE)

      await Promise.all(
        batch.map(async (group) => {
          try {
            const res = await GroupsService.getScheduleForGroup(group)
            setScannedGroups((p) => p + 1)
            localScannedGroups += 1

            if (!res?.Data) return

            res.Data.forEach((lesson) => {
              lessons.push(lesson)

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
            message.error(`Ошибка загрузки группы: ${group}`)
            localErrorGroups.push(group)
          }
        }),
      )
    }

    setAllLessons(lessons)
    setTeachers(Array.from(teachersSet).sort())
    setErrorScannedGroups(localErrorGroups)
    setScannedGroups(localScannedGroups)
    setTimeCodes(localTimeCodes)
    setTimeRanges(localTimeRanges)

    await localforage.setItem('schedule_cache', {
      allLessons: lessons,
      teachers: Array.from(teachersSet).sort(),
      scannedGroups: localScannedGroups,
      errorScannedGroups: localErrorGroups,
      groups: groups,
      timeCodes: localTimeCodes,
      timeRanges: localTimeRanges,
      cachedAt: Date.now(),
    })

    setScanningAGroupsSchedule(false)
    setFinishedFirstGroupsLoading(true)
  }

  useEffect(() => {
    const buildScheduleForTeacher = (teacher: string) => {
      const updatedData: ScheduleRecord[] = structuredClone(defaultTableData)

      allLessons
        .filter((l) => l.Class?.TeacherFull === teacher)
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
      setTableData(updatedData)
    }

    if (selectedTeacher) {
      buildScheduleForTeacher(selectedTeacher)
    }
  }, [allLessons, hideTimeColumn, selectedTeacher, timeCodes, timeRanges])

  return (
    <Spin spinning={loadingGroups} tip="Получение списка групп...">
      <main>
        <CashedInfo timeCashed={timeCashed} setFavoriteTeachers={setFavoriteTeachers} />
        {finishedFirstGroupsLoading && errorScannedGroups.length > 0 && (
          <LoadGroupsAlert
            errorScannedGroups={errorScannedGroups}
            scanningGroupsSchedule={scanningGroupsSchedule}
            loadAllSchedules={loadAllSchedules}
          />
        )}
        {!finishedFirstGroupsLoading && !isGroupsLoadedWithError && (
          <div>
            <GroupFound
              groups={groups}
              scanningGroupsSchedule={scanningGroupsSchedule}
              loadAllSchedules={loadAllSchedules}
            />
          </div>
        )}

        {isGroupsLoadedWithError && (
          <ServerErrorAlert isOpenedOnFreeServer={isOpenedOnFreeServer} />
        )}

        {(scanningGroupsSchedule || finishedFirstGroupsLoading) && groupScannedPercent < 100 && (
          <LoadingProgressBar
            groupScannedPercent={groupScannedPercent}
            scanningGroupsSchedule={scanningGroupsSchedule}
          />
        )}

        {finishedFirstGroupsLoading && (
          <div>
            <MainForm
              teachers={teachers}
              setSelectedTeacher={setSelectedTeacher}
              setSelectedWeekType={setSelectedWeekType}
              setSelectedDayOfWeek={setSelectedDayOfWeek}
              hideEmptyDaysTypes={hideEmptyDaysTypes}
              hideEmptyRows={hideEmptyRows}
              hideTimeColumn={hideTimeColumn}
              setHideEmptyRows={setHideEmptyRows}
              setHideEmptyDaysTypes={setHideEmptyDaysTypes}
              setHideTimeColumn={setHideTimeColumn}
              sortColumnType={sortColumnType}
              setSortColumnType={setSortColumnType}
              selectedDayOfWeek={selectedDayOfWeek}
              selectedWeekType={selectedWeekType}
              selectedTeacher={selectedTeacher}
              favoriteTeachers={favoriteTeachers}
              setFavoriteTeachers={setFavoriteTeachers}
            />
          </div>
        )}

        {finishedFirstGroupsLoading && selectedTeacher && (
          <div>
            <ScheduleTable
              hideEmptyRows={hideEmptyRows}
              tableData={tableData}
              selectedWeekType={selectedWeekType}
              selectedDayOfWeek={selectedDayOfWeek}
              hideEmptyDaysTypes={hideEmptyDaysTypes}
              hideTimeColumn={hideTimeColumn}
              sortColumnType={sortColumnType}
              setSelectedDayOfWeek={setSelectedDayOfWeek}
              setSelectedWeekType={setSelectedWeekType}
            />
            <ExportSchedule selectedTeacher={selectedTeacher} tableData={tableData} />
          </div>
        )}
      </main>
    </Spin>
  )
}
