<template>
  <v-form>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-btn
          color="primary"
          @click="onClickNewTimerButton"
        >
          get a new timer
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { useTimerIdStore } from '../stores/useTimerIdStore'

const timerIdStore = useTimerIdStore()

const postTimer = async () => {
  const host = 'https://example.com'
  const response = await fetch(`${host}/api/timers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })

  return response.text()
}

const onClickNewTimerButton = async () => {
  const data = await postTimer()
  timerIdStore.timerId = data
  timerIdStore.saveTimerId()
}
</script>
