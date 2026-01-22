import { message, Spin } from 'antd'
import { useEffect, useState } from 'react'

import './MainWorkplace.css'

import { defaultTableData } from './tableConfig/defaultTableData'

import {
  GroupFound,
  LoadGroupsAlert,
  LoadingProgressBar,
  MainForm,
  ScheduleTable,
  ServerErrorAlert,
} from '@/components'
import { GroupsService } from '@/data'
import type { ScheduleDataItem, ScheduleRecord, WeekTypes } from '@/types'

interface MainWorkplaceProps {
  isOpenedOnFreeServer: boolean
}

export const MainWorkplace: React.FC<MainWorkplaceProps> = ({ isOpenedOnFreeServer }) => {
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
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null)
  const [selectedWeekType, setSelectedWeekType] = useState<string>('allWeekTypes')

  const [tableData, setTableData] = useState<ScheduleRecord[]>(defaultTableData)
  const [hideEmptyDaysTypes, setHideEmptyDaysTypes] = useState(false)
  const [hideEmptyRows, setHideEmptyRows] = useState(false)
  const [hideTimeColumn, setHideTimeColumn] = useState(false)

  const [timeCodes, setTimeCodes] = useState<number[]>([])
  const [timeRanges, setTimeRanges] = useState<string[]>([])

  useEffect(() => {
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
  }, [])

  const loadAllSchedules = async (groupsToLoad = groups) => {
    setScanningAGroupsSchedule(true)
    if (errorScannedGroups.length == 0) {
      setScannedGroups(0)
    } else {
      setScannedGroups(groups.length - errorScannedGroups.length)
    }

    const BATCH_SIZE = 10
    const lessons = allLessons
    const teachersSet = new Set(teachers)

    for (let i = 0; i < groupsToLoad.length; i += BATCH_SIZE) {
      const batch = groupsToLoad.slice(i, i + BATCH_SIZE)

      await Promise.all(
        batch.map(async (group) => {
          try {
            const res = await GroupsService.getScheduleForGroup(group)
            setScannedGroups((p) => p + 1)

            if (!res?.Data) return

            res.Data.forEach((lesson) => {
              lessons.push(lesson)

              if (lesson.Class?.TeacherFull) {
                teachersSet.add(lesson.Class.TeacherFull)
              }
            })

            if (errorScannedGroups.includes(group)) {
              setErrorScannedGroups((prev) => prev.filter((item) => item !== group))
            }
            if (i == 0) {
              res.Times.forEach((time) => {
                setTimeCodes((prev) => [...prev, time.Code])
                setTimeRanges((prev) => [...prev, `${time.TimeFrom} - ${time.TimeTo}`])
              })
            }
          } catch {
            message.error(`Ошибка загрузки группы: ${group}`)
            setErrorScannedGroups((prev) => [...prev, group])
          }
        }),
      )
    }

    setAllLessons(lessons)
    setTeachers(Array.from(teachersSet).sort())
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
        {errorScannedGroups.length > 0 && finishedFirstGroupsLoading && (
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
            isOpenedOnFreeServer={isOpenedOnFreeServer}
            scanningGroupsSchedule={scanningGroupsSchedule}
          />
        )}

        {finishedFirstGroupsLoading && (
          <div>
            <MainForm
              teachers={teachers}
              setSelectedTeacher={setSelectedTeacher}
              setSelectedWeekType={setSelectedWeekType}
              hideEmptyDaysTypes={hideEmptyDaysTypes}
              hideEmptyRows={hideEmptyRows}
              hideTimeColumn={hideTimeColumn}
              setHideEmptyRows={setHideEmptyRows}
              setHideEmptyDaysTypes={setHideEmptyDaysTypes}
              setHideTimeColumn={setHideTimeColumn}
            />
          </div>
        )}

        {selectedTeacher && (
          <ScheduleTable
            hideEmptyRows={hideEmptyRows}
            tableData={tableData}
            selectedWeekType={selectedWeekType}
            hideEmptyDaysTypes={hideEmptyDaysTypes}
            hideTimeColumn={hideTimeColumn}
          />
        )}
      </main>
    </Spin>
  )
}
