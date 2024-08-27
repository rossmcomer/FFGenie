<script setup lang="ts">
import { ref, onMounted } from 'vue'
import sleeperUserService from "../services/sleeperUser"
import nflOddsService from "../services/nflOdds"
import type { ReducedGameInfo } from "../types"

const sleeperUser = ref<{ user_id: string; display_name: string } | null>(null)
const nflOdds = ref<ReducedGameInfo[] | null>(null)

const fetchSleeperUser = async () => {
  try {
    const data= await sleeperUserService.getSleeperUser()
    sleeperUser.value = data
    console.log(sleeperUser.value)
  } catch (error) {
    console.error('Failed to fetch sleeperUser', error)
  }
}

const fetchNflOdds = async () => {
  try {
    const data= await nflOddsService.getNflOdds()
    nflOdds.value = data
    console.log(nflOdds.value)
  } catch (error) {
    console.error('Failed to fetch NFL odds from DraftKings', error)
  }
}

onMounted(() => {
  fetchSleeperUser()
  fetchNflOdds()
})

</script>

<template>
  <div class="pageContainer">
    <div v-if="sleeperUser" class="userContainer">
      <div>sleeperUserId: {{sleeperUser.display_name}}</div>
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
