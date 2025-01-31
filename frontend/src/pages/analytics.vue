<script setup lang="ts">
import { computed } from "vue";
import type { PositionData } from "../types";
import PPRData2024 from "../assets/2024positionalDataPPR.json";

const data: PositionData[] = PPRData2024.map(item => ({
  position: item.position,
  mean: Number(item.mean),
  median: Number(item.median),
  min: Number(item.min),
  max: Number(item.max)
}));

const calculateStdDev = (min: number, max: number): number => (max - min) / 4;

// Group positions into QB, RB, WR, TE categories
const groupedData = computed(() => {
  return data.reduce<Record<string, PositionData[]>>((acc, item) => {
    const category = item.position.match(/[A-Za-z]+/)?.[0] || "Unknown"; // Extract category (QB, RB, WR, TE)
    if (!acc[category]) acc[category] = [];
    acc[category].push({
      ...item,
      stdDev: calculateStdDev(item.min, item.max)
    });
    return acc;
  }, {});
});

// Function to determine color based on standard deviation
const getColor = (stdDev: number): string => {
  if (stdDev > 30) return "bg-red-500"; // High deviation
  if (stdDev > 15) return "bg-yellow-500"; // Medium deviation
  return "bg-green-500"; // Low deviation
};
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Position Statistics</h1>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- QB Column -->
      <div>
        <h2 class="text-xl font-semibold mb-2">QBs</h2>
        <div v-for="position in groupedData.QB || []" :key="position.position" 
             class="p-4 rounded shadow text-white mb-4" 
             :class="getColor(position.stdDev ?? 0)">
          <h3 class="text-lg font-bold">{{ position.position }}</h3>
          <p>Mean: {{ position.mean }}</p>
          <p>Median: {{ position.median }}</p>
          <p>Min: {{ position.min }}</p>
          <p>Max: {{ position.max }}</p>
          <p>Std Dev: {{ position.stdDev?.toFixed(2) }}</p>
        </div>
      </div>

      <!-- RB Column -->
      <div>
        <h2 class="text-xl font-semibold mb-2">RBs</h2>
        <div v-for="position in groupedData.RB || []" :key="position.position" 
             class="p-4 rounded shadow text-white mb-4" 
             :class="getColor(position.stdDev ?? 0)">
          <h3 class="text-lg font-bold">{{ position.position }}</h3>
          <p>Mean: {{ position.mean }}</p>
          <p>Median: {{ position.median }}</p>
          <p>Min: {{ position.min }}</p>
          <p>Max: {{ position.max }}</p>
          <p>Std Dev: {{ position.stdDev?.toFixed(2) }}</p>
        </div>
      </div>

      <!-- WR Column -->
      <div>
        <h2 class="text-xl font-semibold mb-2">WRs</h2>
        <div v-for="position in groupedData.WR || []" :key="position.position" 
             class="p-4 rounded shadow text-white mb-4" 
             :class="getColor(position.stdDev ?? 0)">
          <h3 class="text-lg font-bold">{{ position.position }}</h3>
          <p>Mean: {{ position.mean }}</p>
          <p>Median: {{ position.median }}</p>
          <p>Min: {{ position.min }}</p>
          <p>Max: {{ position.max }}</p>
          <p>Std Dev: {{ position.stdDev?.toFixed(2) }}</p>
        </div>
      </div>

      <!-- TE Column -->
      <div>
        <h2 class="text-xl font-semibold mb-2">TEs</h2>
        <div v-for="position in groupedData.TE || []" :key="position.position" 
             class="p-4 rounded shadow text-white mb-4" 
             :class="getColor(position.stdDev ?? 0)">
          <h3 class="text-lg font-bold">{{ position.position }}</h3>
          <p>Mean: {{ position.mean }}</p>
          <p>Median: {{ position.median }}</p>
          <p>Min: {{ position.min }}</p>
          <p>Max: {{ position.max }}</p>
          <p>Std Dev: {{ position.stdDev?.toFixed(2) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-red-500 { background-color: #f87171; }
.bg-yellow-500 { background-color: #facc15; }
.bg-green-500 { background-color: #4ade80; }
</style>
