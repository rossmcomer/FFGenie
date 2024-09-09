  <script lang="ts" setup>
  import { computed, PropType } from 'vue';
  import teams from '../assets/teams.json'; // Import your teams JSON
  import { PlayerDetailed, Weather, Stadium, Team } from '../types'; // Import relevant types
  
  // Props to receive data from the parent (Home.vue)
  const props = defineProps<{
    playersDetailed: PlayerDetailed[];
    selectedWeather: Weather[];
  }>();
  
  // Helper function to get the player's team from teams.json
  const getPlayerTeam = (player: PlayerDetailed): Team | undefined => {
    return teams.find((team: Team) => team.abbreviation === player.team);
  };
  
  // Helper function to get weather data for the player's team
  const getWeatherForTeam = (player: PlayerDetailed): Weather | undefined => {
    const playerTeam = getPlayerTeam(player);
    if (!playerTeam) return undefined;
  
    const weatherForTeam = props.selectedWeather.find(
      weather =>
        weather.home_team === playerTeam.name || weather.away_team === playerTeam.name
    );
  
    return weatherForTeam
      ? { ...weatherForTeam, weatherString: typeof weatherForTeam.weather === 'string' ? weatherForTeam.weather : weatherForTeam.weather.condition }
      : undefined;
  };
  </script>

<template>
    <div>
      <div v-for="player in playersDetailed" :key="player.id">
        <div v-if="getPlayerTeam(player)">
          <h3>Player: {{ player.name }}</h3>
          <p>Team: {{ getPlayerTeam(player).name }}</p>
  
          <div v-if="getWeatherForTeam(player)">
            <h4>Weather Information</h4>
            <p>Home Team: {{ getWeatherForTeam(player)?.home_team }}</p>
            <p>Away Team: {{ getWeatherForTeam(player)?.away_team }}</p>
            <p>Weather: {{ getWeatherForTeam(player)?.weatherString }}</p>
          </div>
          <p v-else>No weather information available for this player's game</p>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  
  </style>
  