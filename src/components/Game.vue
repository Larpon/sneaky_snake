<script setup>
import { ref, reactive, watch, onMounted, getCurrentInstance } from 'vue'
import { store } from './store.js'
import { snake } from './snake.js'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

const router = useRouter()
const player_name = ref("")
player_name.value = store.player_name

// Small UX/QoL that redirects the user to enrollment if no name is given.
if (player_name.value == "") {
	router.push('/enroll') // No name set
}

const canvas_element = ref(null)

const score = ref(0)
const tweened_score = reactive({
	score: 0
})

watch(score, (s) => {
	gsap.to(tweened_score, { duration: 0.5, score: Number(s) || 0 })
})

const game_over = ref(false)
const play_time = ref(0)

let last = 0 // Last time stamp
let food = {x: -100, y: -100 }

function getRandomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function spawnFood() {
	const canvas = canvas_element.value
	do {
		food = {
			x: getRandomInt(50,canvas.width - 50),
			y: getRandomInt(50,canvas.height - 50)
		}
	} while (snake.hit(food)) // Don't spawn food on the snake
	return food
}

function drawFood(ctx, food) {
	ctx.beginPath()
	ctx.fillStyle = "#00ff00"
	ctx.arc(food.x + 4, food.y + 4, 4, 0, 2 * Math.PI)
	ctx.fill()
	ctx.closePath()
}

function startGame(event) {
	const canvas = canvas_element.value
	canvas.focus()
	snake.setHead(canvas.width * 0.75, canvas.height * 0.5)
	game_over.value = false
	food = spawnFood()
	last = performance.now()
	requestAnimationFrame(update)
}

function update(now) {
	const canvas = canvas_element.value
	const ctx = canvas.getContext("2d")
	const diff = (now - last)
	play_time.value += diff / 1000

	//console.log(`Now: ${now} Last: ${last} Diff: ${diff}`)

	const dT = diff / 1000
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	snake.update(dT)
	drawFood(ctx, food)
	snake.draw(ctx)

	// Eat food
	if(snake.hitHead(food)) {
		snake.eatFood()
		score.value += 100
		spawnFood()
	}

	// Check for game over conditions
	const head = snake.getHead()
	if(snake.hitBody(head) || head.x < snake.head_radius || head.x > canvas.width - snake.head_radius || head.y < snake.head_radius || head.y > canvas.height - snake.head_radius) {
		game_over.value = true
		store.highscore.push({
			name: player_name.value,
			score: score.value
		})
		router.push('/highscore')
		return
	}

	last = now
	requestAnimationFrame(update)
}

onMounted(() => {
	const canvas = canvas_element.value
	setupCanvas(canvas)
	snake.init(canvas.width * 0.75, canvas.height * 0.5, canvas.width, canvas.height)
})

const setupCanvas = (canvas) => {
	const canvas_parent = canvas.parentNode
	canvas.width = canvas_parent.clientWidth
	canvas.height = canvas_parent.clientWidth * 0.75
}

const onPress = (e) => {
	if (e.keyCode === 37 || e.keyCode === 65) {
		// Left / A
		snake.setDirection('left')
	} else if (e.keyCode === 38 || e.keyCode === 87) {
		// Up / W
		snake.setDirection('up')
	} else if (e.keyCode === 39 || e.keyCode === 68) {
		// Right / D
		snake.setDirection('right')
	} else if (e.keyCode === 40 || e.keyCode === 83) {
		// Down / S
		snake.setDirection('down')
	}

	if (e.keyCode === 69) {
		// e
		snake.eatFood()
		score.value += 100
	}
}

</script>

<template>
  <h1>Be sneaky like a snake {{ player_name }}</h1>
  <p><button @click="startGame">Start</button> Time: {{ new Date(play_time.toFixed(0) * 1000).toISOString().slice(11, 19) }} Score {{ tweened_score.score.toFixed(0) }}</p>
  <canvas tabindex="0" autofocus @keydown.stop="onPress" ref="canvas_element" width="200" height="150"></canvas>
</template>

<style scoped>
canvas {
  background-color: #efefef;
}
</style>
