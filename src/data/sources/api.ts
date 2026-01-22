import axios from 'axios'

const api = axios.create({
  baseURL: '/api/schedule',
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  },
)

export default api
