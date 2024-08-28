<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const nflOdds = computed(() => store.state.nflOdds)
const sleeperUser = computed(() => store.state.sleeperUser)

const username = ref('');

const fetchUser = () => {
  if (username.value) {
    store.dispatch('fetchSleeperUser', username.value);
  }
}

</script>

<template>
  <div class="pageContainer">
    <div v-if="sleeperUser" class="userContainer">
      <form @submit.prevent="fetchUser">
        <input 
          v-model="username" 
          type="text" 
          placeholder="Sleeper username" 
        />
        <button type="submit">Fetch User</button>
    </form>
      <div>sleeperDisplayName: {{sleeperUser.display_name}}</div>
      <div>sleeperUserId: {{sleeperUser.user_id}}</div>
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
