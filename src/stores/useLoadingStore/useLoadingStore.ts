import { create } from 'zustand'

interface LoadingStore {
  groups: string[]
  isGetGroups: boolean
  isGetGroupsError: boolean
  isScanningGroups: boolean
  isGroupsScanned: boolean | null
  scannedGroupsCount: number
  errorScannedGroups: string[]
  updatedAt: number | null
  setGroups: (value: string[]) => void
  setIsGetGroups: (value: boolean) => void
  setIsGetGroupsError: (value: boolean) => void
  setIsScanningGroups: (value: boolean) => void
  setIsGroupsScanned: (value: boolean) => void
  setScannedGroupsCount: (value: number) => void
  setErrorScannedGroups: (value: string[]) => void
  setUpdatedAt: (value: number) => void
}

export const useLoadingStore = create<LoadingStore>((set) => ({
  groups: [],
  isGetGroups: true,
  isGetGroupsError: false,
  isScanningGroups: false,
  isGroupsScanned: null,
  scannedGroupsCount: 0,
  errorScannedGroups: [],
  updatedAt: null,

  setGroups: (value) => set({ groups: value }),
  setIsGetGroups: (value) => set({ isGetGroups: value }),
  setIsGetGroupsError: (value) => set({ isGetGroupsError: value }),
  setIsScanningGroups: (value) => set({ isScanningGroups: value }),
  setIsGroupsScanned: (value) => set({ isGroupsScanned: value }),
  setScannedGroupsCount: (value) => set({ scannedGroupsCount: value }),
  setErrorScannedGroups: (value) => set({ errorScannedGroups: value }),
  setUpdatedAt: (value) => set({ updatedAt: value }),
}))
