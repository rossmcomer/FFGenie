<script setup lang="ts">
import { ref, onMounted } from 'vue'
import injuriesService from "../services/injuries"
// import { InjuryBasic } from '../types'

const injuries = ref<Record<string, any>[]>([])


const fetchInjuries = async () => {
  try {
    const data= await injuriesService.getAllInjuries()
    injuries.value = data.all_injuries_data
    console.log(injuries.value)
  } catch (error) {
    console.error('Failed to fetch injuries:', error)
  }
}

onMounted(() => {
  fetchInjuries()
})

</script>

<template>
    <div class="pageContainer">
      <div v-if="injuries.length > 0" class="injuriesContainer">
        <div
          v-for="(injury, index) in injuries"
          :key="index"
          class="injuryBackgroundContainer"
          :style="{
            backgroundImage: `url(${injury.team_data.logos[0].href})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }"
        >
        </div>
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
