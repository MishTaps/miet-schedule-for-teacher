import type { ScheduleDataItem } from '@/types'
import { create } from 'zustand'

interface LessonsStore {
  lessons: ScheduleDataItem[]
  timeCodes: number[]
  timeRanges: string[]
  setLessons: (value: ScheduleDataItem[]) => void
  setTimeCodes: (value: number[]) => void
  setTimeRanges: (value: string[]) => void
}

export const useLessonsStore = create<LessonsStore>((set) => ({
  lessons: [],
  timeCodes: [],
  timeRanges: [],

  setLessons: (value) => set({ lessons: value }),
  setTimeCodes: (value) => set({ timeCodes: value }),
  setTimeRanges: (value) => set({ timeRanges: value }),
}))
