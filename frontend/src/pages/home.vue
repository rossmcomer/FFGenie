<script setup lang="ts">
import { ref, onMounted } from 'vue'
import injuriesService from "../services/injuries"
// import { InjuryBasic } from '../types'

const injuries = ref([])

const fetchInjuries = async () => {
  try {
    const data= await injuriesService.getAllInjuries()
    injuries.value = data
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
    <div class="pageContainer">test</div>
</template>

<style>
.pageContainer {
  margin-top:80px;
}
</style>
