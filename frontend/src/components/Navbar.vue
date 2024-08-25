<template>
    <nav class="navBarContainer">
        <router-link to="/">Home</router-link>
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
  background-color: rgb(36, 184, 85);
  position: fixed;
  min-width: 344px;
}
    
</style>