<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import teams from '../assets/teams.json'
import type { PlayerDetailed, Weather, WeatherResponse, Stadium, TeamAbbreviation } from '../types'

const props = defineProps<{
    player: PlayerDetailed
    selectedWeather: Weather[]
    selectedStadiums: Stadium[]
}>()

const team = ref<TeamAbbreviation | undefined>(undefined)
const stadium = ref<Stadium | undefined>(undefined)
const weather = ref<WeatherResponse | string | undefined>(undefined)

const getPlayerTeam = (player: PlayerDetailed): TeamAbbreviation | undefined => {
    return teams.find((team: TeamAbbreviation) => team.abbreviation === player.team)
}

const getPlayerStadium = (player: PlayerDetailed): Stadium | undefined => {
    const team = getPlayerTeam(player)
    if (!team) return undefined
    return props.selectedStadiums.find((stadium: Stadium) => stadium.home_team === team.name || stadium.away_team === team.name)
}

const getWeatherForPlayer = (player: PlayerDetailed): WeatherResponse | string | undefined => {
    const playerTeam = getPlayerTeam(player)
    if (!playerTeam) return undefined

    const weatherForPlayer = props.selectedWeather.find(
        weather =>
        weather.home_team === playerTeam.name || weather.away_team === playerTeam.name
    )

    if (weatherForPlayer) {
        if (weatherForPlayer.dome) {
        return 'dome'
        }

    return weatherForPlayer.weather
    }

  return undefined // No matching game or weather found
}

onMounted(() => {
    getPlayerTeam(props.player)
})

watch(team, () => {
    if (team.value) {
        stadium.value = getPlayerStadium(props.player)
    }
})

watch(stadium, () => {
    if (team.value) {
        weather.value = getWeatherForPlayer(props.player)
    }
})

const isString = (data: WeatherResponse | string | undefined): data is string => {
    return typeof data === 'string'
}

const kelvinToFahrenheit = (kelvin: number): number => {
  return (kelvin - 273.15) * 9/5 + 32
}

</script>

<template>
    <div>
      <div>
        <div v-if="getPlayerTeam(player)">
          <h3>Player: {{ player.first_name }}{{ player.last_name }}</h3>
          <p>Team: {{ team?.abbreviation }}</p>
          <p>Stadium: {{ stadium?.stadium }}</p>

          <p v-if="weather === 'dome'">No weather information available for this player's game</p>
          <div v-if="weather && !isString(weather)">
            <h4>Weather Information</h4>
            <p>Temp: {{ kelvinToFahrenheit(weather.main.temp) }}</p>
            <p>Descrtiption: {{ weather.weather[0].description }}</p>
            <img :src="`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`" alt="Weather icon">
            <p>Wind: {{ weather.wind.speed }}</p>
            <p>Gust: {{ weather.wind.gust }}</p>
            <p>Cloud Coverage: {{ weather.clouds.all }}%</p>
          </div>
          
        </div>
      </div>
    </div>
</template>

<style scoped>

</style>
  