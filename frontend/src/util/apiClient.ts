import axios, { AxiosInstance } from 'axios'

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL as string,
})

export default apiClient