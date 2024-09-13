<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import teams from '../assets/teams.json'
import domeIcon from '../assets/dome-icon.png'
import type { PlayerDetailed, Weather, WeatherResponse, Stadium, TeamAbbreviation, ReducedGameInfo } from '../types'

const props = defineProps<{
    player: PlayerDetailed
    selectedWeather: Weather[]
    selectedStadiums: Stadium[]
    selectedGames: ReducedGameInfo[]
}>()

const team = ref<TeamAbbreviation | undefined>(undefined)
const stadium = ref<Stadium | undefined>(undefined)
const weather = ref<WeatherResponse | string | undefined>(undefined)

const getPlayerTeam = async (player: PlayerDetailed): Promise<TeamAbbreviation | undefined> => {
    return new Promise((resolve) => {
        const foundTeam = teams.find((team: TeamAbbreviation) => team.abbreviation === player.team)
        resolve(foundTeam)
    })
}

const getPlayerStadium = async (): Promise<Stadium | undefined> => {
    return new Promise((resolve) => {
        if (!team.value) {
            resolve(undefined)
        } else {
            const foundStadium = props.selectedStadiums.find((stadium: Stadium) => 
                stadium.home_team === team.value?.name || stadium.away_team === team.value?.name
            )
            resolve(foundStadium)
        }
    })
}

const getWeatherForPlayer = async (): Promise<WeatherResponse | string | undefined> => {
    return new Promise((resolve) => {
        if (!team.value) {
            resolve(undefined)
        } else {
            const weatherForPlayer = props.selectedWeather.find(
                weather => 
                weather.home_team === team.value?.name || weather.away_team === team.value?.name
            )

            if (weatherForPlayer) {
                if (weatherForPlayer.dome) {
                    resolve('dome')
                } else {
                    resolve(weatherForPlayer.weather)
                }
            } else {
                resolve(undefined)
            }
        }
    })
}

const fetchData = async () => {
      try {
        team.value = await getPlayerTeam(props.player)
        console.log('team updated:', team.value)

          stadium.value = await getPlayerStadium()
          console.log('stadium updated:', stadium.value)

          weather.value = await getWeatherForPlayer()
          console.log('weather updated:', weather.value)
        
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

onMounted( () => {
    fetchData()
})

const isString = (data: WeatherResponse | string | undefined): data is string => {
    return typeof data === 'string'
}

const kelvinToFahrenheit = (kelvin: number): number => {
  return (kelvin - 273.15) * 9/5 + 32
}

</script>

<template>
    <div v-if="team" class="playerCardContainer">
        <div>{{ player.full_name }}</div>
        <div>{{ player.position }}</div>
        <div>{{ player.team }}</div>
        <img :src="`https://sleepercdn.com/content/nfl/players/${player.player_id}.jpg`" class="playerPic"/>
        <p v-if="stadium">@ {{ stadium?.stadium }}</p>
        <div v-if="weather && !isString(weather)" class="weatherContainer">
            <p>Temp: {{ Math.floor(kelvinToFahrenheit(weather.main.temp)) }}°F</p>
            <p>Descrtiption: {{ weather.weather[0].description }}</p>
            <img :src="`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`" alt="Weather icon">
            <p>Wind: {{ weather.wind.speed }}</p>
            <p>Gust: {{ weather.wind.gust }}</p>
            <p>Cloud Coverage: {{ weather.clouds.all }}%</p>
        </div>
        <div v-if="weather === 'dome'" class="weatherContainer">
            <img :src="`${domeIcon}`" alt="Dome icon">
        </div>
    </div>
</template>

<style scoped>
.playerCardContainer {
    background-color: rgba(0, 0, 0, 0.7);
}

.playerPic {
    height:40px;
}
</style>
  