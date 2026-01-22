import { Button, Result, Spin, Divider } from 'antd'
import { useEffect, useState } from 'react'
import { ExportOutlined } from '@ant-design/icons'
import { SearchOutlined } from '@ant-design/icons'

import './MainWorkplace.css'

import { dataSource } from './dataSource'

import { messages } from './messages'
import type { ScheduleDataItem, ScheduleRecord, WeekTypes } from '../../types'
import { GroupFound, LoadingProgressBar, MainForm, ScheduleTable } from '..'
import { GroupsService } from '../../data'

interface MainWorkplaceProps {
  isOpenedOnFreeServer: boolean
}

export const MainWorkplace: React.FC<MainWorkplaceProps> = ({ isOpenedOnFreeServer }) => {
  const [groups, setGroups] = useState<string[]>([])
  const [loadingGroups, setLoadingGroups] = useState(true)
  const [isGroupsLoadedWithError, setIsGroupsLoadedWithError] = useState(false)

  const [groupsScanned, setGroupsScanned] = useState(0)
  const groupScannedPercent = Math.round((groupsScanned / (groups.length || 1)) * 100)

  const [allLessons, setAllLessons] = useState<ScheduleDataItem[]>([])
  const [teachers, setTeachers] = useState<string[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null)
  const [selectedWeekType, setSelectedWeekType] = useState<string>('allWeekTypes')

  const [rawTableData, setRawTableData] = useState<ScheduleRecord[]>(dataSource)
  const [hideEmptyDaysTypes, setHideEmptyDaysTypes] = useState(false)
  const [hideEmptyRows, setHideEmptyRows] = useState(false)

  const [loadingAllGroupsSchedule, setLoadingAllGroupsSchedule] = useState(false)

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

  const loadAllSchedules = async () => {
    setLoadingAllGroupsSchedule(true)
    setGroupsScanned(0)

    const BATCH_SIZE = 10
    const lessons: ScheduleDataItem[] = []
    const teachersSet = new Set<string>()

    for (let i = 0; i < groups.length; i += BATCH_SIZE) {
      const batch = groups.slice(i, i + BATCH_SIZE)

      await Promise.all(
        batch.map(async (group) => {
          try {
            const res = await GroupsService.getScheduleForGroup(group)
            setGroupsScanned((p) => p + 1)

            if (!res?.Data) return

            res.Data.forEach((lesson) => {
              lessons.push(lesson)

              if (lesson.Class?.TeacherFull) {
                teachersSet.add(lesson.Class.TeacherFull)
              }
            })
          } catch {
            console.error(`Ошибка загрузки группы ${group}`)
          }
        }),
      )
    }

    setAllLessons(lessons)
    setTeachers(Array.from(teachersSet).sort())
    setLoadingAllGroupsSchedule(false)
  }

  useEffect(() => {
    const buildScheduleForTeacher = (teacher: string) => {
      const updatedData: ScheduleRecord[] = structuredClone(dataSource)

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
            const oldData = existingInfo.split('\n')
            const oldGroups = oldData[0]
            const oldClasses = oldData[1]
            const oldRooms = oldData[2]
            const newGroupsArray = oldGroups.split(',').map((g) => g.trim())
            const newClassesArray = oldClasses.split(',').map((g) => g.trim())
            const newRoomsArray = oldRooms.split(',').map((g) => g.trim())

            let mergedGroups = oldGroups
            let mergedClasses = oldClasses
            let mergedRooms = oldRooms

            if (!newGroupsArray.includes(newGroup)) {
              newGroupsArray.push(newGroup)
              const sortedGroups = newGroupsArray.sort()
              mergedGroups = sortedGroups.join(', ')
            }
            if (!newClassesArray.includes(newClass)) {
              newClassesArray.push(newClass)
              const sortedClasses = newClassesArray.sort()
              mergedClasses = sortedClasses.join(' / ')
            }
            if (!newRoomsArray.includes(newRoom)) {
              newRoomsArray.push(newRoom)
              const sortedRooms = newRoomsArray.sort()
              mergedRooms = sortedRooms.join(', ')
            }

            mergedInfo = `${mergedGroups}\n${mergedClasses}\n${mergedRooms}`
          } else {
            mergedInfo = `${newGroup}\n${newClass}\n${newRoom}`
          }

          updatedData[timeIndex] = {
            ...currentRow,
            [dayKey]: {
              ...currentDay,
              [weekKey]: mergedInfo,
            },
          }
        })

      setRawTableData(updatedData)
    }

    if (selectedTeacher) {
      buildScheduleForTeacher(selectedTeacher)
    }
  }, [allLessons, selectedTeacher])

  return (
    <Spin spinning={loadingGroups} tip="Получение списка групп...">
      <main>
        {groupScannedPercent != 100 && (
          <div>
            <GroupFound groups={groups} />
            <Divider>Получение данных</Divider>
            <div style={{ padding: '0 30px', margin: '0 auto', maxWidth: '400px' }}>
              <Button
                type="primary"
                block
                loading={loadingAllGroupsSchedule}
                onClick={loadAllSchedules}
                icon={<SearchOutlined />}
                style={{ width: '100%' }}
              >
                Получить данные о расписании групп
              </Button>
            </div>
          </div>
        )}

        {isGroupsLoadedWithError && (
          <Result
            status="500"
            title="Ошибка сервера"
            subTitle={isOpenedOnFreeServer ? messages.onlineServer : messages.localServer}
            extra={
              isOpenedOnFreeServer ? (
                <Button
                  type="primary"
                  href="https://github.com/MishTaps/miet-schedule-for-teacher/tree/main?tab=readme-ov-file#%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA-%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D1%8B-%D0%BB%D0%BE%D0%BA%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE"
                  target="_blank"
                >
                  Узнать, как развернуть локально <ExportOutlined />
                </Button>
              ) : null
            }
          />
        )}

        {loadingAllGroupsSchedule && groupScannedPercent < 100 && (
          <LoadingProgressBar
            groupScannedPercent={groupScannedPercent}
            isOpenedOnFreeServer={isOpenedOnFreeServer}
          />
        )}

        {teachers.length > 0 && (
          <div>
            <MainForm
              teachers={teachers}
              setSelectedTeacher={setSelectedTeacher}
              hideEmptyDaysTypes={hideEmptyDaysTypes}
              setHideEmptyDaysTypes={setHideEmptyDaysTypes}
              hideEmptyRows={hideEmptyRows}
              setHideEmptyRows={setHideEmptyRows}
              setSelectedWeekType={setSelectedWeekType}
            />
          </div>
        )}

        {selectedTeacher && (
          <ScheduleTable
            hideEmptyRows={hideEmptyRows}
            rawTableData={rawTableData}
            selectedWeekType={selectedWeekType}
            hideEmptyDaysTypes={hideEmptyDaysTypes}
          />
        )}
      </main>
    </Spin>
  )
}
