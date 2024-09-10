import type { Stadium } from '../types.ts'

const getWeather = async (stadium: Stadium) => {
    try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${stadium.lat}&lon=${stadium.lon}&appid=${import.meta.env.VITE_OPENWEATHERMAP_API_KEY}`)
    const weather = await response.json()

    return weather
    } catch (error) {
        console.error(`Error fetching weather for game ${stadium.stadium}`, error)
        return null
    }
}
    
export default { getWeather }