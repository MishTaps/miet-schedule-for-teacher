import { useLessonsStore, useTeachersStore, useLoadingStore } from '@/stores'
import type { ScheduleDataItem } from '@/types'
import localforage from 'localforage'
import { useCallback, useEffect } from 'react'

export const useLoadCache = () => {
  const setLessons = useLessonsStore((state) => state.setLessons)
  const setTimeCodes = useLessonsStore((state) => state.setTimeCodes)
  const setTimeRanges = useLessonsStore((state) => state.setTimeRanges)

  const setTeachers = useTeachersStore((state) => state.setTeachers)
  const setFavoriteTeachers = useTeachersStore((state) => state.setFavoriteTeachers)

  const setScannedGroupsCount = useLoadingStore((state) => state.setScannedGroupsCount)
  const setErrorScannedGroups = useLoadingStore((state) => state.setErrorScannedGroups)
  const setIsGroupsScanned = useLoadingStore((state) => state.setIsGroupsScanned)
  const setGroups = useLoadingStore((state) => state.setGroups)
  const setIsGetGroups = useLoadingStore((state) => state.setIsGetGroups)
  const setUpdatedAt = useLoadingStore((state) => state.setUpdatedAt)

  const loadScheduleCache = useCallback(async () => {
    try {
      const cached = (await localforage.getItem('schedule_cache')) as {
        allLessons: ScheduleDataItem[]
        teachers: string[]
        groups: string[]
        timeCodes: number[]
        timeRanges: string[]
        scannedGroups: number
        errorScannedGroups: string[]
        cachedAt: number
        favoriteTeachers?: string[]
      } | null
      if (cached) {
        setUpdatedAt(cached.cachedAt)
        setLessons(cached.allLessons)
        setTeachers(cached.teachers)
        setGroups(cached.groups)
        setScannedGroupsCount(cached.scannedGroups)
        setErrorScannedGroups(cached.errorScannedGroups)
        setIsGroupsScanned(true)
        setIsGetGroups(false)
        setTimeCodes(cached.timeCodes)
        setTimeRanges(cached.timeRanges)
      } else {
        setIsGroupsScanned(false)
      }
    } catch (e) {
      console.error('Ошибка чтения schedule_cache в кэше', e)
    }
  }, [
    setUpdatedAt,
    setLessons,
    setTeachers,
    setGroups,
    setScannedGroupsCount,
    setErrorScannedGroups,
    setIsGroupsScanned,
    setIsGetGroups,
    setTimeCodes,
    setTimeRanges,
  ])

  const loadPersonalDataCache = useCallback(async () => {
    try {
      const cached = (await localforage.getItem('personal_data')) as {
        favoriteTeachers: string[]
      } | null
      if (cached) {
        setFavoriteTeachers(cached.favoriteTeachers)
      }
    } catch (e) {
      console.error('Ошибка чтения personal_data в кэше', e)
    }
  }, [setFavoriteTeachers])

  useEffect(() => {
    loadScheduleCache()
    loadPersonalDataCache()
  }, [loadPersonalDataCache, loadScheduleCache])

  return { loadScheduleCache, loadPersonalDataCache }
}
