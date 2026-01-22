import { Button, Result, Spin, Divider } from 'antd'
import { useEffect, useState } from 'react'
import { ExportOutlined } from '@ant-design/icons'
import { SearchOutlined } from '@ant-design/icons'

import './MainWorkplace.css'

import { defaultTableData } from './tableConfig/defaultTableData'

import { messages } from './messages'
import { GroupFound, LoadingProgressBar, MainForm, ScheduleTable } from '@/components'
import { GroupsService } from '@/data'
import type { ScheduleDataItem, ScheduleRecord, WeekTypes } from '@/types'

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

  const [tableData, setTableData] = useState<ScheduleRecord[]>(defaultTableData)
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
            const blocks = existingInfo.split('\n---\n')
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
            tableData={tableData}
            selectedWeekType={selectedWeekType}
            hideEmptyDaysTypes={hideEmptyDaysTypes}
          />
        )}
      </main>
    </Spin>
  )
}
