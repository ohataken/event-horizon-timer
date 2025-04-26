<template>
  <v-form>
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-btn
          density="comfortable"
          icon="mdi-stop"
          @click="stopTimer"
        ></v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          density="comfortable"
          icon="mdi-play"
          @click="startTimer"
        ></v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          density="comfortable"
          icon="mdi-bell-ring"
          @click="ping"
        ></v-btn>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-select
          label="status"
          :items="['stopped', 'running']"
          v-model="status"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-text-field
          type="number"
          label="minutes"
          v-model="durationMinutes"
          @update:model-value="(val) => durationMinutes = Number(val)"
          @change="updateDuration"
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field 
          type="number"
          label="seconds"
          v-model="durationSeconds"
          @update:model-value="(val) => durationSeconds = Number(val)"
          @change="updateDuration"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-form>
  <v-btn
    color="primary"
    @click="updateTimer"
  >
    save
  </v-btn>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useTimerIdStore } from '../stores/useTimerIdStore'

const timerIdStore = useTimerIdStore()

const status = ref('')
const duration = ref(0)
const targetTime = ref(0)

const durationMinutes = ref(0)
const durationSeconds = ref(0)

const fetchTimer = async (id: string) => {
  const host = 'https://example.com'
  const response = await fetch(`${host}/api/timers/${id}`)
  return response.json()
}

const putTimer = async (id: string, object: object) => {
  const host = 'https://example.com'
  const response = await fetch(`${host}/api/timers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },    
    body: JSON.stringify(object),
  })
  return response.json()
}

const updateTimer = async () => {
  const object = {
    status: status.value,
    duration: duration.value,
    target_time: targetTime.value,
  }

  await putTimer(timerIdStore.timerId, object)
}

const getTimer = async () => {
  const data = await fetchTimer(timerIdStore.timerId)
  console.log(data)
  status.value = data.timer.status 
  duration.value = parseInt(data.timer.duration)
  durationMinutes.value = Math.floor(duration.value / 60)
  durationSeconds.value = duration.value % 60
  targetTime.value = data.timer.targetTime
}

const stopTimer = async () => {
  status.value = 'stopped'
  targetTime.value = 0

  await putTimer(timerIdStore.timerId, {
    status: status.value,
    duration: duration.value,
    target_time: targetTime.value,
  })
}

const startTimer = async () => {
  const now = new Date()
  const date = new Date(now.getTime() + duration.value * 1000)

  status.value = 'running'
  targetTime.value = date.getTime() / 1000

  await putTimer(timerIdStore.timerId, {
    status: status.value,
    duration: duration.value,
    target_time: targetTime.value,
  })
}

const postPing = async (id: string) => {
  const host = 'https://example.com'
  const response = await fetch(`${host}/api/timers/${id}/ping`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
  return response.json()
}

const ping = async () => {
  await postPing(timerIdStore.timerId)
}

const updateDuration = () => {
  duration.value = durationMinutes.value * 60 + durationSeconds.value
}

(async () => {
  await timerIdStore.fetchTimerId()
  await getTimer()
})()

</script>
