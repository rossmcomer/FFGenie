import axios from '../util/apiClient'
const baseUrl = '/players'

const getAllInjuries = async () => {
  const response = await axios.post(baseUrl)
  return response.data
}

export default { getAllInjuries }
