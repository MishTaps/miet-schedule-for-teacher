import { defaultTableData } from '@/components/MainWorkplace/tableConfig/defaultTableData'
import type { ScheduleDataItem, ScheduleRecord, WeekTypes } from '@/types'

interface buildScheduleForTeacherProps {
  lessons: ScheduleDataItem[]
  selectedTeacher: string
  timeCodes: number[]
  hideTimeColumn: boolean
  timeRanges: string[]
}

export const buildScheduleForTeacher = ({
  lessons,
  selectedTeacher,
  timeCodes,
  hideTimeColumn,
  timeRanges,
}: buildScheduleForTeacherProps) => {
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
