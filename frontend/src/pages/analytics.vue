<script setup lang="ts">
import { computed } from "vue"
import type { PositionData } from "../types"
import PPRData2024 from "../assets/2024positionalDataPPR.json"

// Initialize the data by mapping and converting it into proper numerical values
const data: PositionData[] = PPRData2024.map((item) => ({
  position: item.position,
  mean: Number(item.mean),
  median: Number(item.median),
  min: Number(item.min),
  max: Number(item.max),
}))

// Function to calculate standard deviation
const calculateStdDev = (min: number, max: number): number => (max - min) / 4

// Function to determine color based on standard deviation
const getColor = (stdDev: number): string => {
  if (stdDev > 30) return "high" // High deviation (red)
  if (stdDev > 15) return "medium" // Medium deviation (yellow)
  return "low" // Low deviation (green)
}

// Group positions into QB, RB, WR, TE categories
const groupedData = computed(() => {
  return data.reduce<Record<string, PositionData[]>>((acc, item) => {
    const category = item.position.match(/[A-Za-z]+/)?.[0] || "Unknown" // Extract category (QB, RB, WR, TE)
    if (!acc[category]) acc[category] = []
    acc[category].push({
      ...item,
      stdDev: calculateStdDev(item.min, item.max),
    })
    return acc
  }, {})
})
</script>

<template>
  <div class="container">
    <h1>Position Statistics</h1>

    <!-- QB Section -->
    <div class="category">
      <h2>QBs</h2>
      <div
        v-for="position in groupedData.QB || []"
        :key="position.position"
        :class="['position-box', getColor(position.stdDev ?? 0)]"
      >
        <h3>{{ position.position }}</h3>
        <p>Mean: {{ position.mean }}</p>
        <p>Median: {{ position.median }}</p>
        <p>Min: {{ position.min }}</p>
        <p>Max: {{ position.max }}</p>
        <p>Std Dev: {{ position.stdDev?.toFixed(2) }}</p>
      </div>
    </div>

    <!-- RB Section -->
    <div class="category">
      <h2>RBs</h2>
      <div
        v-for="position in groupedData.RB || []"
        :key="position.position"
        :class="['position-box', getColor(position.stdDev ?? 0)]"
      >
        <h3>{{ position.position }}</h3>
        <p>Mean: {{ position.mean }}</p>
        <p>Median: {{ position.median }}</p>
        <p>Min: {{ position.min }}</p>
        <p>Max: {{ position.max }}</p>
        <p>Std Dev: {{ position.stdDev?.toFixed(2) }}</p>
      </div>
    </div>

    <!-- WR Section -->
    <div class="category">
      <h2>WRs</h2>
      <div
        v-for="position in groupedData.WR || []"
        :key="position.position"
        :class="['position-box', getColor(position.stdDev ?? 0)]"
      >
        <h3>{{ position.position }}</h3>
        <p>Mean: {{ position.mean }}</p>
        <p>Median: {{ position.median }}</p>
        <p>Min: {{ position.min }}</p>
        <p>Max: {{ position.max }}</p>
        <p>Std Dev: {{ position.stdDev?.toFixed(2) }}</p>
      </div>
    </div>

    <!-- TE Section -->
    <div class="category">
      <h2>TEs</h2>
      <div
        v-for="position in groupedData.TE || []"
        :key="position.position"
        :class="['position-box', getColor(position.stdDev ?? 0)]"
      >
        <h3>{{ position.position }}</h3>
        <p>Mean: {{ position.mean }}</p>
        <p>Median: {{ position.median }}</p>
        <p>Min: {{ position.min }}</p>
        <p>Max: {{ position.max }}</p>
        <p>Std Dev: {{ position.stdDev?.toFixed(2) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Basic styling */
.container {
  padding: 20px;
}

h1 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.category {
  margin-bottom: 20px;
}

.category h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.position-box {
  display: inline-block;
  margin: 10px;
  padding: 10px;
  border: 1px solid rgba(10, 43, 16);
  color: rgba(10, 43, 16);
  border-radius: 4px;
  text-align: center;
  width: 150px; /* Adjust width to fit data inside the box */
  height: auto;
}

/* Colors based on standard deviation */
.position-box.high {
  background-color: #f87171; /* Red for high standard deviation */
}

.position-box.medium {
  background-color: #facc15; /* Yellow for medium standard deviation */
}

.position-box.low {
  background-color: #4ade80; /* Green for low standard deviation */
}

.position-box h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: bold;
}

.position-box p {
  font-size: 0.9rem;
  margin: 4px 0;
}
</style>
