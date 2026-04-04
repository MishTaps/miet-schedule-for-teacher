import { GroupsService } from '@/data'
import { useLoadingStore } from '@/stores'
import { useCallback, useEffect } from 'react'

export const useFetchGroups = () => {
  const isGroupsScanned = useLoadingStore((state) => state.isGroupsScanned)
  const setGroups = useLoadingStore((state) => state.setGroups)
  const setIsGetGroups = useLoadingStore((state) => state.setIsGetGroups)
  const setIsGetGroupsError = useLoadingStore((state) => state.setIsGetGroupsError)

  const fetchGroups = useCallback(async () => {
    try {
      const groupsData = await GroupsService.getGroups()
      setGroups(groupsData)
    } catch {
      setIsGetGroupsError(true)
    } finally {
      setIsGetGroups(false)
    }
  }, [setGroups, setIsGetGroups, setIsGetGroupsError])

  useEffect(() => {
    if (isGroupsScanned === false) {
      fetchGroups()
    }
  }, [fetchGroups, isGroupsScanned, setGroups, setIsGetGroups, setIsGetGroupsError])
}
