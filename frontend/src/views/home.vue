<script lang="ts">
import { ref, onMounted } from 'vue';
import injuriesService from "../services/injuries"

const injuries = ref([]);

const fetchInjuries = async () => {
  try {
    const data = await injuriesService.getAllInjuries();
    injuries.value = data;
  } catch (error) {
    console.error('Failed to fetch injuries:', error);
  }
};

onMounted(() => {
  fetchInjuries();
});
</script>

<template>
</template>

<style scoped>
</style>
