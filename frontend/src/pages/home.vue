<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useStore } from "vuex"
import type {
  League,
  ReducedGameInfo,
  Stadium,
  Weather,
  PlayerDetailed,
} from "../types"
import PlayerCard from "../components/PlayerCard.vue"
import fetchWeeklyGames from "../services/fetchWeeklyGames"
import fetchSelectedStadiums from "../services/fetchSelectedStadiums"
import fetchWeatherForSelectedGames from "../services/fetchWeatherForSelectedGames"

const store = useStore()
const nflOdds = computed(() => store.state.nflOdds)
const sleeperUser = computed(() => store.state.sleeperUser)
const selectedRoster = computed(() => store.state.selectedRoster)
const playersDetailed = computed(() => store.state.playersDetailed)
const selectedWeek = computed(() => store.state.weekNumber)
const positions = computed(() => store.state.positions)
const selectedLeague = computed({
  get() {
    return store.state.selectedLeague
  },
  set(value) {
    store.dispatch("setSelectedLeague", value)
  },
})

const username = ref<string>()
const selectedGames = ref<ReducedGameInfo[]>([])
const selectedStadiums = ref<Stadium[]>([])
const selectedWeather = ref<Weather[]>([])

const fetchUser = () => {
  if (username.value) {
    store.dispatch("fetchSleeperUser", username.value)
  }
}

const fetchRoster = () => {
  store.dispatch("setSelectedLeague", selectedLeague.value).then(() => {
    if (selectedLeague.value.league_id != "") {
      const league = sleeperUser.value.leagues.find(
        (l: League) => l.name === selectedLeague.value.name,
      )

      if (league) {
        store
          .dispatch("fetchRosterFromLeague", {
            userId: sleeperUser.value.user_id,
            leagueId: league.league_id,
          })

          .then(() => {
            store.dispatch("fetchPlayerDetails", {
              players: selectedRoster.value.players,
              reserve: selectedRoster.value.reserve,
            })
          })
          .catch((error) => {
            console.error("Failed to fetch roster or player details:", error)
          })
      }
    }
  })
}

onMounted(async () => {
  try {
    await store.dispatch("fetchNflOdds")

    await store.dispatch("getWeekNumber")

    selectedGames.value = await fetchWeeklyGames(
      selectedWeek.value,
      nflOdds.value,
    )

    selectedStadiums.value = await fetchSelectedStadiums(selectedGames.value)

    selectedWeather.value = await fetchWeatherForSelectedGames(
      selectedGames.value,
      selectedStadiums.value,
    )
  } catch (error) {
    console.error("Error fetching data:", error)
  }
})
</script>

<template>
  <div class="pageContainer">
    <div v-if="sleeperUser.user_id === ''" class="instructions">
      Enter your Sleeper username to get started!
    </div>
    <div
      v-if="sleeperUser.user_id !== '' && selectedLeague.league_id == ''"
      class="instructions"
    >
      Select your league from the dropdown menu below!
    </div>
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
      <select
        v-model="selectedLeague"
        @change="fetchRoster"
        name="leagueSelector"
        class="leagueSelector"
      >
        <option disabled value="">Select League</option>
        <option
          v-for="league in sleeperUser.leagues"
          :key="league.league_id"
          :value="league"
          class="leagueName"
        >
          {{ league.name }}
        </option>
      </select>
      <!-- <div v-if="sleeperUser.display_name != ''">
        <div>{{sleeperUser.display_name}}</div>
        <img :src="`https://sleepercdn.com/avatars/${sleeperUser.avatar}`" class="profilePic" alt="sleeper Avatar"/>
      </div> -->
    </div>
    <div v-if="selectedRoster.players[0]" class="playerCardsContainer">
      <div
        v-for="(position, index) in positions"
        :key="index"
        class="positionContainerWrapper"
      >
        <div
          v-if="
            playersDetailed.find((p: PlayerDetailed) => p.position === position)
          "
          class="positionContainer"
        >
          <div class="positionHeader">{{ position }}</div>
          <div class="playerCards">
            <div
              v-for="(player, index) in playersDetailed.filter(
                (p: PlayerDetailed) => p.position === position,
              )"
              :key="index"
            >
              <PlayerCard
                :player="player"
                :selectedWeather="selectedWeather"
                :selectedStadiums="selectedStadiums"
                :selectedGames="selectedGames"
                :selectedWeek="selectedWeek"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.pageContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.instructions {
  font-style: italic;
  text-shadow: rgba(0, 0, 0, 0.432) 1px 4px 20px;
}

.userContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 10px;
  width: 350px;
}

.userForm {
  margin-bottom: 5px;
  display: flex;
}

.usernameInput {
  padding: 5px;
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
  color: rgba(10, 43, 16);
}

.usernameInput:focus {
  outline: none;
}

.fetchUserButton {
  border-radius: 4px;
  background-color: rgba(10, 43, 16, 0.9);
  border: 1px solid transparent;
  padding: 0.2em 0.4em;
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
  outline: none;
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
  width: 40px;
}

.playerCardsContainer {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
}

.positionContainer {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.positionHeader {
  color: rgba(10, 43, 16, 1);
  font-weight: 700;
  font-size: 18px;
}

.playerCards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
</style>
