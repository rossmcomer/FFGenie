<script setup lang="ts">
import { ref, onMounted } from 'vue'
import sleeperUserService from "../services/sleeperUser"

const sleeperUser = ref<{ user_id: string; display_name: string } | null>(null)

const fetchSleeperUser = async () => {
  try {
    const data= await sleeperUserService.getSleeperUser()
    sleeperUser.value = data
    console.log(sleeperUser.value)
  } catch (error) {
    console.error('Failed to fetch sleeperUser', error)
  }
}

onMounted(() => {
  fetchSleeperUser()
})

</script>

<template>
  <div class="pageContainer">
    <div v-if="sleeperUser" class="userContainer">
      <div>sleeperUserId: {{sleeperUser.display_name}}</div>
    </div>
  </div>
</template>

<style>
.pageContainer {
  margin-top:80px;
}
</style>
