import axios from 'axios'
import { message } from 'antd'

const api = axios.create({
  baseURL: '/api/schedule',
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    message.error('Ошибка сети или сервера')
    return Promise.reject(error)
  },
)

export default api
