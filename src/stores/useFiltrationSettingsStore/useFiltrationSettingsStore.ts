import type { SelectedDayOfWeekType, SelectedWeekType } from '@/types'
import { create } from 'zustand'

interface FiltrationSettingsStore {
  selectedDayOfWeek: SelectedDayOfWeekType
  selectedWeekType: SelectedWeekType
  setSelectedDayOfWeek: (value: SelectedDayOfWeekType) => void
  setSelectedWeekType: (value: SelectedWeekType) => void
}

export const useFiltrationSettingsStore = create<FiltrationSettingsStore>((set) => ({
  selectedDayOfWeek: 'allDays',
  selectedWeekType: 'allWeekTypes',

  setSelectedDayOfWeek: (value) => set({ selectedDayOfWeek: value }),
  setSelectedWeekType: (value) => set({ selectedWeekType: value }),
}))
