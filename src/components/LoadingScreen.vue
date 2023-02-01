<template>
  <div
    class="loading-screen row justify-center items-center"
    :class="[store.loading ? '' : 'off']"
  >
    <div class="text-h1">Baby Tracker</div>
  </div>
</template>

<script setup lang="ts">
import { useTabStore } from 'src/stores/tab-store';

const store = useTabStore();
</script>

<style scoped>
.loading-screen {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0%;
  z-index: 9999;
  background: white;
  transition: top 0.2s ease-in-out;
  box-shadow: 0px 0 20px rgba(0, 0, 0, 0.3);
}
.off {
  top: 100%;
}
</style>
