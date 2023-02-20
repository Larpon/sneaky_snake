<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from './store.js'

const router = useRouter()
const player_name = ref("")
player_name.value = store.player_name
const scores = ref("")

function compare_highscore( a, b ) {
	if(a.score < b.score) {
		return 1
	}
	if( a.score > b.score) {
		return -1
	}
	return 0
}

store.highscore.sort( compare_highscore )

scores.value = store.highscore.slice(0, 10)

</script>

<template>
  <h1>Highscores</h1>
  <ul>
    <li v-for="score in scores">
      {{ score.name }} {{ score.score }}
    </li>
  </ul>
</template>
