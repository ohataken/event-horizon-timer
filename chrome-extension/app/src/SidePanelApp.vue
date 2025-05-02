<template>
  <v-app>
    <v-main>
      <Timer v-if="timerIdStore.timerId" />
      <CreateTimer v-else />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useTimerIdStore } from './stores/useTimerIdStore'
import Timer from './components/Timer.vue'
import CreateTimer from './components/CreateTimer.vue'

const timerIdStore = useTimerIdStore()
timerIdStore.fetchTimerId()
</script>
