import type { Stadium } from '../types.ts'

const getWeather = async (stadium: Stadium) => {
    const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${stadium.lat}&lon=${stadium.lon}&appid=${import.meta.env.VITE_OPENWEATHERMAP_API_KEY}`)
    const data = await response.json()

    //main.temp, weather[0].description, weather[0].icon, wind.speed, wind.gust, and clouds.all
    return data
}
    
export default { getWeather }