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
