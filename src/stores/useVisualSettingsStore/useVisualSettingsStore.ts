import type { SortColumnType } from '@/types'
import { create } from 'zustand'

interface VisualSettingsStore {
  hideEmptyDaysTypes: boolean
  hideEmptyRows: boolean
  hideTimeColumn: boolean
  sortColumnType: SortColumnType
  setHideEmptyDaysTypes: (value: boolean) => void
  setHideEmptyRows: (value: boolean) => void
  setHideTimeColumn: (value: boolean) => void
  setSortColumnType: (value: SortColumnType) => void
}

const isOpenedOnPhone = window.innerWidth < 576

export const useVisualSettingsStore = create<VisualSettingsStore>((set) => ({
  hideEmptyDaysTypes: true,
  hideEmptyRows: true,
  hideTimeColumn: isOpenedOnPhone,
  sortColumnType: 'day',

  setHideEmptyDaysTypes: (value) => set({ hideEmptyDaysTypes: value }),
  setHideEmptyRows: (value) => set({ hideEmptyRows: value }),
  setHideTimeColumn: (value) => set({ hideTimeColumn: value }),
  setSortColumnType: (value) => set({ sortColumnType: value }),
}))
