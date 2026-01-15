import axios from 'axios'
import type { ScheduleResponse } from '../../../types'
import { message } from 'antd'

const api = axios.create({
  baseURL: '/',
})

async function getGroups() {
  try {
    const response = await api.get<string[]>('/api/schedule/groups')
    if (response.data.length === 0) {
      message.open({
        type: 'error',
        content: 'Список групп пуст. Возможно, произошла ошибка на сервере.',
        duration: 5,
      })
    }
    return response.data
  } catch (error) {
    console.error('Ошибка запроса групп:', error)
    return null
  }
}

async function getScheduleForGroup(group: string) {
  try {
    const response = await api.get<ScheduleResponse>(`/api/schedule/data`, { params: { group } })
    return response.data
  } catch (error) {
    console.error('Ошибка запроса расписания:', error)
    return null
  }
}

export const GroupsService = {
  getGroups,
  getScheduleForGroup,
}
