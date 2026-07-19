import { GroupsService } from '@/data'
import { useLessonsStore, useLoadingStore, useTeachersStore } from '@/stores'
import localforage from 'localforage'

export const useScanGroups = () => {
  const groups = useLoadingStore((state) => state.groups)
  const errorScannedGroups = useLoadingStore((state) => state.errorScannedGroups)
  const scannedGroupsCount = useLoadingStore((state) => state.scannedGroupsCount)
  const setIsScanningGroups = useLoadingStore((state) => state.setIsScanningGroups)
  const setScannedGroupsCount = useLoadingStore((state) => state.setScannedGroupsCount)
  const setErrorScannedGroups = useLoadingStore((state) => state.setErrorScannedGroups)
  const setIsGroupsScanned = useLoadingStore((state) => state.setIsGroupsScanned)
  const setUpdatedAt = useLoadingStore((state) => state.setUpdatedAt)

  const teachers = useTeachersStore((state) => state.teachers)
  const setTeachers = useTeachersStore((state) => state.setTeachers)

  const lessons = useLessonsStore((state) => state.lessons)
  const timeCodes = useLessonsStore((state) => state.timeCodes)
  const timeRanges = useLessonsStore((state) => state.timeRanges)
  const setLessons = useLessonsStore((state) => state.setLessons)
  const setTimeCodes = useLessonsStore((state) => state.setTimeCodes)
  const setTimeRanges = useLessonsStore((state) => state.setTimeRanges)

  const loadAllSchedules = async (groupsToLoad = groups) => {
    let localErrorGroups = [...errorScannedGroups]
    let localScannedGroups = scannedGroupsCount
    const localTimeCodes = [...timeCodes]
    const localTimeRanges = [...timeRanges]

    setIsScanningGroups(true)
    if (errorScannedGroups.length == 0) {
      setScannedGroupsCount(0)
      localScannedGroups = 0
    } else {
      setScannedGroupsCount(groups.length - errorScannedGroups.length)
      localScannedGroups = groups.length - errorScannedGroups.length
    }

    const BATCH_SIZE = 10
    const loadedLessons = [...lessons]
    const teachersSet = new Set(teachers)

    for (let i = 0; i < groupsToLoad.length; i += BATCH_SIZE) {
      const batch = groupsToLoad.slice(i, i + BATCH_SIZE)

      await Promise.all(
        batch.map(async (group) => {
          try {
            const res = await GroupsService.getScheduleForGroup(group)
            localScannedGroups += 1
            setScannedGroupsCount(localScannedGroups)

            if (!res?.Data) return

            res.Data.forEach((lesson) => {
              loadedLessons.push(lesson)

              if (lesson.Class?.TeacherFull) {
                teachersSet.add(lesson.Class.TeacherFull)
              }
            })

            if (errorScannedGroups.includes(group)) {
              localErrorGroups = localErrorGroups.filter((item) => item !== group)
              setErrorScannedGroups([...localErrorGroups])
            }
            if (i == 0) {
              res.Times.forEach((time) => {
                localTimeCodes.push(time.Code)
                localTimeRanges.push(`${time.TimeFrom} - ${time.TimeTo}`)
              })
            }
          } catch {
            localErrorGroups = [...localErrorGroups, group]
            setErrorScannedGroups([...localErrorGroups])
          }
        }),
      )
    }

    const localUpdatedAt = Date.now()
    setLessons(loadedLessons)
    setTeachers(Array.from(teachersSet).sort())
    setErrorScannedGroups(localErrorGroups)
    setScannedGroupsCount(localScannedGroups)
    setTimeCodes(localTimeCodes)
    setTimeRanges(localTimeRanges)
    setUpdatedAt(localUpdatedAt)

    await localforage.setItem('schedule_cache', {
      allLessons: loadedLessons,
      teachers: Array.from(teachersSet).sort(),
      scannedGroups: localScannedGroups,
      errorScannedGroups: localErrorGroups,
      groups: groups,
      timeCodes: localTimeCodes,
      timeRanges: localTimeRanges,
      cachedAt: localUpdatedAt,
    })

    setIsScanningGroups(false)
    setIsGroupsScanned(true)
  }

  return { loadAllSchedules }
}
