import type { GameInfo, ReducedGameInfo } from '../types'

const getWeather = async () => {
    const response = await fetch(``)
    const data = await response.json()
    
    return data
    }
    
export default { getWeather }