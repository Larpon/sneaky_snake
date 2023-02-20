// store.js
import { reactive, watch } from 'vue'

// Ideally, the storing of data should be done via local storage or, even better, via
// a remote database - but we store it for the page session life-time for now.
export const store = reactive({
	player_name: '',
	highscore: [],
})

// Kept for debugging purposes
// watch(store, (s) => {
// 	console.log(s)
// })
