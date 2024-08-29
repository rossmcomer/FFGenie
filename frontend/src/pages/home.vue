<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import type { League } from '../types'


const store = useStore()

const nflOdds = computed(() => store.state.nflOdds)
const sleeperUser = computed(() => store.state.sleeperUser)
const selectedRoster = computed(() => store.state.selectedRoster)

const username = ref<string>('')
const selectedLeague = ref<League>([])

const fetchUser = () => {
  if (username.value) {
    store.dispatch('fetchSleeperUser', username.value)
  }
}

const fetchRoster = () => {
  if (selectedLeague.value) {
    console.log(selectedLeague.value)
    console.log(sleeperUser.value)
    const league = sleeperUser.value.leagues.find((l: League) => l.name === selectedLeague.value.name)
    if (league) {
      console.log(league)
      store.dispatch('fetchRosterFromLeague', { userId: sleeperUser.value.user_id, leagueId: league.league_id });
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
          type="text" 
          placeholder="Sleeper username" 
        />
        <button type="submit">Fetch User</button>
      </form>
      <select v-model="selectedLeague" @change="fetchRoster">
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
      <div v-if="selectedRoster[0] != null">
        <div>roster {{ selectedRoster.roster }}</div>
        <div>reserve {{ selectedRoster.reserve }}</div>
      </div>
    </div>
    <div v-if="nflOdds" class="oddsContainer">
      <div v-for="(oddsObject, index) in nflOdds" :key="index" class="oddsItem">
      <div>Start time:{{ oddsObject.commence_time }}</div>
      <div>{{ oddsObject.home_team }}</div>
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
