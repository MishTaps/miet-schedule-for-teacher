interface ScheduleTime {
  Time: string
  Code: number
  TimeFrom: string
  TimeTo: string
}

interface ScheduleClass {
  Code: string
  Name: string
  TeacherFull: string
  Teacher: string
  Form: boolean
}

interface ScheduleGroup {
  Code: string
  Name: string
}

interface ScheduleRoom {
  Code: number
  Name: string
}

export interface ScheduleDataItem {
  Day: number
  DayNumber: number
  Time: ScheduleTime
  Class: ScheduleClass
  Group: ScheduleGroup
  Room: ScheduleRoom
}

export interface ScheduleResponse {
  Times: ScheduleTime[]
  Data: ScheduleDataItem[]
  Semestr: string
}

export type WeekTypes = {
  weekType0: string
  weekType1: string
  weekType2: string
  weekType3: string
  [key: string]: string
}

export type ScheduleRecord = {
  key: string
  lesson: string
  day1: WeekTypes
  day2: WeekTypes
  day3: WeekTypes
  day4: WeekTypes
  day5: WeekTypes
  day6: WeekTypes
  [key: string]: string | WeekTypes
}
