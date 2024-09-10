<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import type { League, ReducedGameInfo, Stadium, InternationalGame, Weather } from '../types'
import { isWithinInterval, addDays, startOfDay } from 'date-fns'
import internationalGames from '../assets/internationalGames.json'
import stadiums from '../assets/stadiums.json'
import weatherService from '../services/weather'
import PlayerCard from '../components/PlayerCard.vue'


const store = useStore()
const nflOdds = computed(() => store.state.nflOdds)
const sleeperUser = computed(() => store.state.sleeperUser)
const selectedRoster = computed(() => store.state.selectedRoster)
const playersDetailed = computed(() => store.state.playersDetailed)

const username = ref<string>('')
const selectedLeague = ref<League>({league_id:'', name: ''})
const selectedWeek = ref<number | ''>('')
const selectedGames = ref<ReducedGameInfo[]>([])
const selectedStadiums = ref<Stadium[]>([])
const selectedWeather = ref<Weather[]>([])

const weeks = Array.from({ length: 18 }, (_, i) => i + 1)
const seasonStartDate = new Date('2024-09-05T00:00:00Z')

const fetchUser = () => {
  if (username.value) {
    store.dispatch('fetchSleeperUser', username.value)
  }
}

const fetchRoster = () => {
  if (selectedLeague.value.league_id != '') {
    const league = sleeperUser.value.leagues.find((l: League) => l.name === selectedLeague.value.name)

    if (league) {
      store.dispatch('fetchRosterFromLeague', { userId: sleeperUser.value.user_id, leagueId: league.league_id })
      .then(() => {
          store.dispatch('fetchPlayerDetails', { players: selectedRoster.value.players, reserve: selectedRoster.value.reserve })
        })
      .catch((error) => {
        console.error('Failed to fetch roster or player details:', error)
      })
    }
  }
}

const handleWeekChange = async (event: Event) => {
  const target = event.target as HTMLSelectElement
  const week = Number(target.value)

  try {
    await fetchWeeklyGames(week)
    console.log(selectedGames, 'selectedGames')
    await fetchSelectedStadiums(selectedGames.value)
    console.log(selectedStadiums, 'selectedStadiums')
    await fetchWeatherForSelectedGames(selectedGames.value, selectedStadiums.value)
    console.log(selectedWeather, 'selectedWeather')
  } catch (error) {
    console.error("Error fetching data:", error)
  }
}

const fetchWeeklyGames = (week: number): Promise<void> => {
  return new Promise((resolve) => {
    if (!week) return resolve()
    
    const startOfWeek = addDays(seasonStartDate, (week - 1) * 7)
    const endOfWeek = addDays(startOfWeek, 6)
    console.log(nflOdds)

    const filteredGames = nflOdds.value.filter((game: ReducedGameInfo) => {
      return isWithinInterval(game.commence_time, { start: startOfDay(startOfWeek), end: startOfDay(endOfWeek) })
    })
    console.log(filteredGames, 'filteredGames')

    selectedGames.value = filteredGames
    resolve()
  })
}

const fetchSelectedStadiums = (selectedGames: ReducedGameInfo[]): Promise<void> => {
  return new Promise((resolve) => {
    selectedStadiums.value = []
    selectedGames.forEach((game: ReducedGameInfo) => {
      const matchedInternationalGame = internationalGames.find((internationalGame: InternationalGame) => internationalGame.gameId === game.id) || null

      if (matchedInternationalGame) {
        selectedStadiums.value.push({
          home_team: matchedInternationalGame.home_team,
          away_team: matchedInternationalGame.away_team,
          stadium: matchedInternationalGame.stadium,
          lat: matchedInternationalGame.lat,
          lon: matchedInternationalGame.lon,
          dome: matchedInternationalGame.dome
        })
      } else {
        const stadium = stadiums.find(stadium => stadium.team === game.home_team)
        if (stadium) {
          selectedStadiums.value.push({
            home_team: game.home_team,
            away_team: game.away_team,
            stadium: stadium.stadium,
            lat: stadium.lat,
            lon: stadium.lon,
            dome: stadium.dome
          })
        }
      }
    })
    resolve()
  })
}

const fetchWeatherForSelectedGames = async (selectedGames: ReducedGameInfo[], selectedStadiums: Stadium[]): Promise<void> => {
  const weatherData = await Promise.all(
    selectedGames.map(async (game: ReducedGameInfo) => {
      const stadium = selectedStadiums.find(stadium => stadium.home_team === game.home_team)

      if (stadium) {
        try {
          const weather = await weatherService.getWeather(stadium)

          return {
            home_team: game.home_team,
            away_team: game.away_team,
            stadium: stadium.stadium,
            weather
          }
        } catch (error) {
          console.error(`Error fetching weather for game ${game.home_team} vs ${game.away_team}:`, error)
          return null
        }
      } else {
        console.error(`Stadium not found for game with home team: ${game.home_team}`)
        return null
      }
    })
  )

  selectedWeather.value = weatherData.filter(data => data !== null) as Weather[]
}
</script>

<template>
  <div class="pageContainer">
    <div class="userContainer">
      <form @submit.prevent="fetchUser">
        <input 
          v-model="username" 
          name="usernameInput"
          type="text" 
          placeholder="Sleeper username" 
        />
        <button type="submit">Fetch User</button>
      </form>
      <select v-model="selectedLeague" @change="fetchRoster" name="leagueSelector">
          <option disabled value="">Select League</option>
          <option v-for="league in sleeperUser.leagues" :key="league" :value="league">
            {{ league.name }}
          </option>
      </select>
      <select v-model="selectedWeek" @change="handleWeekChange" name="weekSelector">
          <option disabled value="">Select Week</option>
          <option v-for="week in weeks" :key="week" :value="week">
            Week {{ week }}
          </option>
      </select>
      <div v-if="sleeperUser.display_name != ''">
        <div>sleeperDisplayName: {{sleeperUser.display_name}}</div>
        <img :src="`https://sleepercdn.com/avatars/${sleeperUser.avatar}`" alt="sleeper Avatar"/>
        <div>sleeperUserId: {{sleeperUser.user_id}}</div>
        <div>{{ sleeperUser.leagues }}</div>
        <!-- <div v-for="(leagueId, index) in sleeperUser.leagueIds" :key="index" class="leagueId"></div> -->
      </div>
      <div v-if="selectedRoster.players[0]">
        <div>roster {{ selectedRoster.players }}</div>
        <div>reserve {{ selectedRoster.reserve }}</div>
        <div v-for="(player, index) in playersDetailed" :key="index" class="playersDetailed">
          <div class="playerCardContainer">
            <PlayerCard :player="player"
                        :selectedWeather="selectedWeather"
                        :selectedStadiums="selectedStadiums"/>
            <div>{{ player.full_name }}</div>
            <div>{{ player.position }}</div>
            <div>{{ player.team }}</div>
            <img :src="`https://sleepercdn.com/content/nfl/players/${player.player_id}.jpg`"/>
          </div>
        </div>
      </div>
    </div>
    <div v-if="selectedGames.length > 0" class="oddsContainer">
      <div v-for="(game, index) in selectedGames" :key="index" class="oddsItem">
      <div>Start time:{{ game.commence_time }}</div>
      <div>Home Team:{{ game.home_team }}</div>
      <div>{{ game.away_team }}</div>
      <div>O/U{{ game.over_under }}</div>
      <div><i>last updated:</i>{{ game.last_update }}</div>
    </div>
    </div>
  </div>
</template>

<style>
.pageContainer {
  margin-top:80px;
}
</style>
