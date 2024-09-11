<template>
    <nav class="navBarContainer">
        <router-link to="/" class="link">FFGenie</router-link>
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
  display:flex;
  justify-content: center;
  align-items: center;
  font-size: 60px;
  border-bottom: 4px solid #213547;
}
.link {
  font-style: italic;
}
    
</style>