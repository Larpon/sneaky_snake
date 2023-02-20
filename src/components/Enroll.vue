<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import  { store } from './store.js'

const router = useRouter()
const player_name = ref('')
const is_not_empty = ref(false)

watch(player_name, (name) => {
	is_not_empty.value = name != ""
})

function play(event) {
	store.player_name = player_name.value
	router.push('/game') // Go to GameView / Game
}
</script>

<template>
  <h1>Enter your name</h1>
  <input v-model="player_name" placeholder="Sneaky Snake Jimmy" />
  <button v-if="is_not_empty" @click="play">Play Game as "{{ player_name }}"</button>
  <button v-else>Enter name</button>
</template>
