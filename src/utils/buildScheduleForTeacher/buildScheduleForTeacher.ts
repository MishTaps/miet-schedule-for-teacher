import { defaultTableData } from '@/components/MainWorkplace/tableConfig/defaultTableData'
import type { ScheduleDataItem, ScheduleRecord, WeekTypes } from '@/types'

interface buildTableForTeacherProps {
  lessons: ScheduleDataItem[]
  selectedTeacher: string
  timeCodes: number[]
  hideTimeColumn: boolean
  timeRanges: string[]
}

const createEmptyWeekTypes = (): WeekTypes => ({
  weekType0: '',
  weekType1: '',
  weekType2: '',
  weekType3: '',
})

const mergeLessonInfo = (
  existingInfo: string,
  newGroup: string,
  newClass: string,
  newRoom: string,
  timeCode: number,
) => {
  const existingInfoWithoutTime = existingInfo.startsWith(`${timeCode} пара`)
    ? existingInfo.split('\n').slice(2).join('\n')
    : existingInfo

  const blocks = existingInfoWithoutTime.split('\n---\n')
  let isFoundMatch = false

  const updatedBlocks = blocks.map((block) => {
    const [blockGroups, blockClass, blockRoom] = block.split('\n')

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

  return updatedBlocks.join('\n---\n')
}

const formatTimeRange = (timeRange: string) => {
  return timeRange
    .split(' - ')
    .map((str) => {
      const date = new Date(str)
      return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      })
    })
    .join(' - ')
}

const addTimeIfNeeded = (
  mergedInfo: string,
  hideTimeColumn: boolean,
  timeCode: number,
  timeRange: string,
) => {
  if (!hideTimeColumn) return mergedInfo

  if (mergedInfo.startsWith(`${timeCode} пара`)) return mergedInfo

  const timeName = `${timeCode} пара`
  const formattedRange = formatTimeRange(timeRange)

  return `${timeName}\n${formattedRange}\n${mergedInfo}`
}

export const buildTableForTeacher = ({
  lessons,
  selectedTeacher,
  timeCodes,
  hideTimeColumn,
  timeRanges,
}: buildTableForTeacherProps) => {
  const updatedData: ScheduleRecord[] = structuredClone(defaultTableData)

  for (const lesson of lessons) {
    if (lesson.Class?.TeacherFull !== selectedTeacher) continue

    const timeIndex = lesson.Time.Code - 1
    const timeCode = timeCodes[timeIndex]
    const timeRange = timeRanges[timeIndex]

    const dayKey = `day${lesson.Day}`
    const weekKey = `weekType${lesson.DayNumber}`

    if (!updatedData[timeIndex]) continue

    const currentTime = updatedData[timeIndex]
    const currentDay = (currentTime[dayKey] as WeekTypes) ?? createEmptyWeekTypes()

    const newGroup = lesson.Group.Name
    const newClass = lesson.Class.Name
    const newRoom = lesson.Room.Name

    let mergedInfo = ''

    const existingInfo = currentDay[weekKey]

    if (existingInfo) {
      mergedInfo = mergeLessonInfo(existingInfo, newGroup, newClass, newRoom, timeCode)
    } else {
      mergedInfo = `${newGroup}\n${newClass}\n${newRoom}`
    }

    mergedInfo = addTimeIfNeeded(mergedInfo, hideTimeColumn, timeCode, timeRange)

    updatedData[timeIndex] = {
      ...currentTime,
      [dayKey]: {
        ...currentDay,
        [weekKey]: mergedInfo,
      },
    }
  }

  return updatedData
}
