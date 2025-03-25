<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="timer id"
              v-model="timerIdStore.timerId"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn
              color="primary"
              @click="submit"
            >
              save
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useTimerIdStore } from './stores/useTimerIdStore'

const timerIdStore = useTimerIdStore()

const submit = async () => {
  await timerIdStore.saveTimerId()
}

(async () => {
  await timerIdStore.fetchTimerId()
})()
</script>
