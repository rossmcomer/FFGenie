import type { Stadium } from '../types.ts'

const getWeather = async (stadium: Stadium) => {
    try {
        if (stadium.dome){
            return 'dome'
        }
    const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${stadium.lat}&lon=${stadium.lon}&appid=${import.meta.env.VITE_OPENWEATHERMAP_API_KEY}`)
    const data = await response.json()

    //main.temp, weather[0].description, weather[0].icon, wind.speed, wind.gust, and clouds.all
    return data
    } catch (error) {
        console.error(`Error fetching weather for game ${stadium.stadium}`, error)
        return null
    }
}
    
export default { getWeather }