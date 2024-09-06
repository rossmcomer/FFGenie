import type { Stadium } from '../types.ts'

const getWeather = async (stadium: Stadium, time: Date) => {
    const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${stadium.lat}&lon=${stadium.lon}&dt=${time}&appid=${import.meta.env.VITE_OPENWEATHERMAP_API_KEY}`)
    const data = await response.json()
    return data
}
    
export default { getWeather }