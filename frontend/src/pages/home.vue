<script setup lang="ts">
import { ref, onMounted } from 'vue'
import sleeperUserService from "../services/sleeperUser"

const sleeperUser = ref<{ avatar: string; display_name: string } | null>(null)

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
      
    </div>
  </div>
</template>

<style>
.pageContainer {
  margin-top:80px;
}

.injuriesContainer {
    display:flex;
    flex-wrap:wrap;
    justify-content: space-evenly;
}
.injuryBackgroundContainer {
    box-shadow: rgb(143, 143, 143) 2px 10px 10px;
    background-color:black;
    color: white;
    margin: 10px;
    width:340px;
}

.injuryContainer {
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
    height: 100%;
    width: 100%;
}
</style>
