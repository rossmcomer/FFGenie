<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import type { League, ReducedGameInfo, Stadium, InternationalGame, Weather, PlayerDetailed } from '../types'
import { isWithinInterval, addDays, startOfDay, differenceInDays } from 'date-fns'
import internationalGames from '../assets/internationalGames.json'
import stadiums from '../assets/stadiums.json'
import weatherService from '../services/weather'
import PlayerCard from '../components/PlayerCard.vue'


const store = useStore()
const nflOdds = computed(() => store.state.nflOdds)
const sleeperUser = computed(() => store.state.sleeperUser)
const selectedRoster = computed(() => store.state.selectedRoster)
const playersDetailed = computed(() => store.state.playersDetailed)

const seasonStartDate = new Date('2024-09-05T00:00:00Z')
const username = ref<string>()
const selectedLeague = ref<League>({league_id:'', name: ''})
const selectedWeek = ref<number>(1)
const selectedGames = ref<ReducedGameInfo[]>([])
const selectedStadiums = ref<Stadium[]>([])
const selectedWeather = ref<Weather[]>([])

const positions = ['QB','RB','WR','TE','K','DEF']

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

const getWeekNumber = async (): Promise<number> => {
  const todaysDate = new Date()
  const daysSinceStart = differenceInDays(todaysDate, seasonStartDate)
  const weekNumber = Math.floor(daysSinceStart / 7) + 2

  console.log(daysSinceStart, weekNumber)

  selectedWeek.value = weekNumber

  return weekNumber
}

const fetchWeeklyGames = async (week: number): Promise<ReducedGameInfo[]> => {

  const startOfWeekDate = addDays(seasonStartDate, (week - 1) * 7)
  const endOfWeekDate = addDays(startOfWeekDate, 6)

  console.log(startOfWeekDate, endOfWeekDate)
console.log(nflOdds.value)

  const filteredGames = nflOdds.value.filter((game: ReducedGameInfo) => {
    return isWithinInterval(game.commence_time, { start: startOfDay(startOfWeekDate), end: startOfDay(endOfWeekDate) })
  })

  console.log(filteredGames)

  selectedGames.value = filteredGames

  return filteredGames
}

const fetchSelectedStadiums = async (games: ReducedGameInfo[]): Promise<Stadium[]> => {
  const weeklyStadiums = [];

  for (const game of games) {
    const matchedInternationalGame = internationalGames.find((internationalGame: InternationalGame) => internationalGame.gameId === game.id)

    if (matchedInternationalGame) {
      weeklyStadiums.push({
        home_team: matchedInternationalGame.home_team,
        away_team: matchedInternationalGame.away_team,
        stadium: matchedInternationalGame.stadium,
        lat: matchedInternationalGame.lat,
        lon: matchedInternationalGame.lon,
        dome: matchedInternationalGame.dome
      })
    } else {
      const stadium = stadiums.find(stadium => stadium.team === game.home_team);
      if (stadium) {
        weeklyStadiums.push({
          home_team: game.home_team,
          away_team: game.away_team,
          stadium: stadium.stadium,
          lat: stadium.lat,
          lon: stadium.lon,
          dome: stadium.dome
        })
      }
    }
  }

  selectedStadiums.value = weeklyStadiums

  return weeklyStadiums
}

const fetchWeatherForSelectedGames = async (selectedGames: ReducedGameInfo[], selectedStadiums: Stadium[]): Promise<Weather[]> => {
  const weatherData = await Promise.all(
    selectedGames.map(async (game: ReducedGameInfo) => {
      const stadium = selectedStadiums.find(stadium => stadium.home_team === game.home_team)

      if (stadium && !stadium.dome) {
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
      } else if (stadium){
        return {
            home_team: game.home_team,
            away_team: game.away_team,
            stadium: stadium.stadium,
            weather: null,
            dome: true
          }
      } else {
        return null
      }
    })
  )
  const weather = weatherData.filter(data => data !== null) as Weather[]
  selectedWeather.value = weather

  return weather
}

onMounted(async () => {
  try {

    await store.dispatch('fetchNflOdds')

    await getWeekNumber()

    await fetchWeeklyGames(selectedWeek.value)
    
    await fetchSelectedStadiums(selectedGames.value)
    
    await fetchWeatherForSelectedGames(selectedGames.value, selectedStadiums.value)
    
  } catch (error) {
    console.error("Error fetching data:", error)
  }
})
</script>

<template>
  <div class="pageContainer">
    <div v-if="sleeperUser.user_id === ''" class="instructions">Enter your Sleeper username to get started!</div>
    <div v-if="sleeperUser.user_id !== '' && selectedLeague.league_id == ''" class="instructions">Select your league from the dropdown menu below!</div>
    <div class="userContainer">
      <form @submit.prevent="fetchUser" class="userForm">
        <input 
          v-model="username" 
          name="usernameInput"
          type="text" 
          placeholder="Sleeper username"
          class="usernameInput" 
        />
        <button type="submit" class="fetchUserButton">Fetch User</button>
      </form>
      <select v-model="selectedLeague" @change="fetchRoster" name="leagueSelector" class="leagueSelector">
          <option disabled value="">Select League</option>
          <option v-for="league in sleeperUser.leagues" :key="league" :value="league" class="leagueName">
            {{ league.name }}
          </option>
      </select>
      <!-- <div v-if="sleeperUser.display_name != ''">
        <div>{{sleeperUser.display_name}}</div>
        <img :src="`https://sleepercdn.com/avatars/${sleeperUser.avatar}`" class="profilePic" alt="sleeper Avatar"/>
      </div> -->
    </div>
    <div v-if="selectedRoster.players[0]" class="playerCardsContainer">
      <div v-for="(position, index) in positions" :key=index class="positionContainerWrapper"> 
        <div v-if="playersDetailed.find((p: PlayerDetailed) => p.position === position)" class="positionContainer"> 
          <div class="positionHeader">{{ position }}</div>
          <div class="playerCards">
          <div v-for="(player, index) in playersDetailed.filter((p: PlayerDetailed) => p.position === position)" :key="index">
              <PlayerCard :player="player"
                          :selectedWeather="selectedWeather"
                          :selectedStadiums="selectedStadiums"
                          :selectedGames="selectedGames"/>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.pageContainer {
  margin-top:80px;
  display:flex;
  flex-direction: column;
  align-items: center;
}

.instructions {
  font-style: italic;
  text-shadow: rgba(0, 0, 0, 0.432) 1px 4px 20px;
}

.userContainer {
  display:flex;
  flex-direction: column;
  justify-content: center;
  margin:10px;
  width: 350px;
}

.userForm {
  margin-bottom: 5px;
  display:flex;
}

.usernameInput {
  padding:5px;
  border-radius: 4px;
  border: 2px solid rgba(10, 43, 16);
  background-color: rgb(141, 141, 141);
  color: rgba(10, 43, 16);
  font-size: 14px;
  width: 200px;
  margin: 0px 5px;
  box-sizing: border-box;
  box-shadow: #00000046 1px 1px 10px;
}

::placeholder {
  color: rgba(10, 43, 16)
}

.usernameInput:focus {
  outline: none
}

.fetchUserButton {
  border-radius: 4px;
  background-color: rgba(10, 43, 16, 0.9);
  border: 1px solid transparent;
  padding: 0.2em .4em;
  font-size: 1em;
  font-weight: 400;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.25s;
  width: 150px;
  margin-right: 5px;
  box-sizing: border-box;
  box-shadow: #00000046 1px 1px 10px;
}

button:hover {
  border-color: #ffffffb6;
}
button:focus,
button:focus-visible {
  outline: none
}

.leagueSelector {
  font-size: 16px;
  font-weight: 600;
  padding: 5px;
  border: 1px solid transparent;
  border-radius: 4px;
  border: 2px solid rgba(10, 43, 16);
  background-color: rgb(141, 141, 141);
  color: rgba(10, 43, 16);
  box-shadow: #00000046 1px 1px 10px;
  cursor: pointer;
}

.leagueSelector:focus {
  outline: none;
}

.leagueName {
  font-weight: 300;
}

.profilePic {
  height: 40px;
  width: 40px
}

.playerCardsContainer {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;  
}

.positionContainer {
  display:flex;
  flex-direction: column;
  flex-wrap:wrap;
  justify-content: center;
  align-items: center;
}

.positionHeader {
  color: rgba(10, 43, 16, 1);
  font-weight: 700;
  font-size: 18px;
}

.playerCards {
  display:flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
</style>
