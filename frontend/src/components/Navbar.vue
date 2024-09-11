<template>
    <nav class="navBarContainer">
        <router-link to="/">Home</router-link>
        <router-link to="/MyTeam">My Team</router-link>
    </nav>
</template>
<script lang="ts">
// defineProps<{ msg: string }>()
export default {
    
}
</script>
<style scoped>
.navBarContainer {
  width: 100%;
  height: 80px;
  background-color: #5E9942;
  position: fixed;
  min-width: 344px;
  z-index: 1;
  top: 0;
}
    
</style>