<script lang="ts" setup>
import { ref, onMounted } from 'vue'
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
    const playerTeam = getPlayerTeam(player);
    if (!playerTeam) return undefined;

    const weatherForPlayer = props.selectedWeather.find(
        weather =>
        weather.home_team === playerTeam.name || weather.away_team === playerTeam.name
    )

    if (weatherForPlayer){
        const { weather } = weatherForPlayer
        return weather
    }
    
    return undefined
}

const isWeatherResponse = (data: WeatherResponse | string | undefined): data is WeatherResponse => {
  return typeof data === 'object' && data !== null 
}

const isString = (data: WeatherResponse | string | undefined): data is string => {
  return typeof data === 'string'
}

const fetchWeatherDetails = async () => {
    team.value = getPlayerTeam(props.player)

    if (team.value) {
        stadium.value = getPlayerStadium(props.player)
    }

    if (stadium.value) {
        weather.value = getWeatherForPlayer(props.player)
    }
}

onMounted(() => {
    fetchWeatherDetails()
})

</script>

<template>
    <div>
      <div>
        <div v-if="getPlayerTeam(player)">
          <h3>Player: {{ player.first_name }}{{ player.last_name }}</h3>
          <p>Team: {{ getPlayerTeam(player)?.name }}</p>
          <p>Stadium: {{ getPlayerStadium(player)?.stadium }}</p>
  
          <!-- <div v-if="isWeatherResponse(weather)">
            <h4>Weather Information</h4>
            <p>Temp: {{ getWeatherForPlayer(player)?.weather.description }}</p>
            <p>Descrtiption: {{ getWeatherForPlayer(player)?.weatherString }}</p>
            <p>Icon: {{ getWeatherForPlayer(player)?.weatherString }}</p>
            <p>Wind: {{ getWeatherForPlayer(player)?.weatherString }}</p>
            <p>Clouds: {{ getWeatherForPlayer(player)?.weatherString }}</p>
          </div>
          <p v-else-if="isString(weather))">No weather information available for this player's game</p> -->
        </div>
      </div>
    </div>
</template>

<style scoped>

</style>
  