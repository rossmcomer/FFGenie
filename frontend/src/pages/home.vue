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
      <div v-for="(injury, index) in injuries" :key="index">
      {{injury.id}}
      </div>
    </div>
</template>

<style>
.pageContainer {
  margin-top:80px;
}
</style>
