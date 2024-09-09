<script lang="ts" setup>
import { computed, PropType } from 'vue'
import teams from '../assets/teams.json'
import type { PlayerDetailed, PlayersDetailed, Weather, WeatherResponse, Stadium, TeamAbbreviation } from '../types'

const props = defineProps<{
    playersDetailed: PlayersDetailed
    selectedWeather: Weather[]
    selectedStadiums: Stadium[]
}>()

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
  </script>

<template>
    <div>
      <div v-for="player in playersDetailed" :key="player.player_id">
        <div v-if="getPlayerTeam(player)">
          <h3>Player: {{ player.first_name }}{{ player.last_name }}</h3>
          <p>Team: {{ getPlayerTeam(player)?.name }}</p>
          <p>Stadium: {{ getPlayerStadium(player)?.stadium }}</p>
  
          <div v-if="isWeatherResponse(getWeatherForPlayer(player))">
            <h4>Weather Information</h4>
            <p>Temp: {{ getWeatherForPlayer(player)?.weather.description }}</p>
            <p>Descrtiption: {{ getWeatherForPlayer(player)?.weatherString }}</p>
            <p>Icon: {{ getWeatherForPlayer(player)?.weatherString }}</p>
            <p>Wind: {{ getWeatherForPlayer(player)?.weatherString }}</p>
            <p>Clouds: {{ getWeatherForPlayer(player)?.weatherString }}</p>
          </div>
          <p v-else-if="isString(getWeatherForPlayer(player))">No weather information available for this player's game</p>
        </div>
      </div>
    </div>
</template>

<style scoped>

</style>
  