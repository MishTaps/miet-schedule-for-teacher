import type { ScheduleResponse } from '../../../types'
import api from '../api'

export const GroupsService = {
  async getGroups(): Promise<string[]> {
    try {
      const { data } = await api.get<string[]>('/groups')
      if (!data || data.length === 0) {
        throw new Error('EMPTY_GROUPS')
      }
      if (!Array.isArray(data)) {
        throw new Error('INVALID_GROUPS_FORMAT')
      }
      return data
    } catch (error) {
      console.error('Ошибка при получении групп:', error)
      throw error
    }
  },

  async getScheduleForGroup(group: string): Promise<ScheduleResponse> {
    const { data } = await api.get<ScheduleResponse>('/data', {
      params: { group },
    })
    return data
  },
}
