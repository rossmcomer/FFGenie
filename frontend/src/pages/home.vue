<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import type { League } from '../types'


const store = useStore()
const nflOdds = computed(() => store.state.nflOdds)
const sleeperUser = computed(() => store.state.sleeperUser)
const selectedRoster = computed(() => store.state.selectedRoster)
const playersDetailed = computed(() => store.state.playersDetailed)

const username = ref<string>('')
const selectedLeague = ref<League>({league_id:'', name: ''})

// watch(selectedRoster, (newValue) => {
//   console.log('Selected Roster changed:', newValue);
// });

const fetchUser = () => {
  if (username.value) {
    store.dispatch('fetchSleeperUser', username.value)
  }
}

const fetchRoster = () => {
  if (selectedLeague.value.league_id != '') {
    const league = sleeperUser.value.leagues.find((l: League) => l.name === selectedLeague.value.name)
    console.log('league', league)
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
            <div>{{ player.full_name }}</div>
            <div>{{ player.position }}</div>
            <div>{{ player.team }}</div>
            <img :src="`https://sleepercdn.com/content/nfl/players/${player.player_id}.jpg`"/>
          </div>
        </div>
      </div>
    </div>
    <div v-if="nflOdds" class="oddsContainer">
      <div v-for="(oddsObject, index) in nflOdds" :key="index" class="oddsItem">
      <div>Start time:{{ oddsObject.commence_time }}</div>
      <div>Home Team:{{ oddsObject.home_team }}</div>
      <div>{{ oddsObject.away_team }}</div>
      <div>O/U{{ oddsObject.over_under }}</div>
      <div><i>last updated:</i>{{ oddsObject.last_update }}</div>
    </div>
    </div>
  </div>
</template>

<style>
.pageContainer {
  margin-top:80px;
}
</style>
