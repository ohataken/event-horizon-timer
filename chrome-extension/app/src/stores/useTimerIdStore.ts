import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTimerIdStore = defineStore('timerId', () => {
  const timerId = ref<string>('')

  const fetchTimerId = async () => {
    const data = await chrome.storage.local.get({
      timerId: '',
    })

    timerId.value = data.timerId
  }

  const saveTimerId = async () => {
    return chrome.storage.local.set({
      timerId: timerId.value,
    })
  }

  return {
    timerId,
    fetchTimerId,
    saveTimerId,
  }
})
