// snake.js

export const snake = {
	// An array with center points of each circle making up the body. index = 0 is the head
	parts: [],
	// Target radius of each part the snake
	radius: 8,
	head_radius: 8*1.2,
	// Color of the snake
	color: '#ff0000',
	// Angle of the head
	dir: 'left',
	aim: {x:0,y:0},
	// Velocity
	velocity: 100,
	// Bounds of the movement area
	bounds: {width:0,height:0},

	// Init the snake
	init(x,y,width,height) {
		this.parts = []
		this.velocity = 100
		this.dir = 'left'
		this.bounds.width = width
		this.bounds.height = height
		this.aim.x = -width
		this.aim.y = y
		this.parts.push({
			x: x,
			y: y
		})

		for (let i = 1; i < 4; i++) {
			this.parts.push({
				x: x,
				y: y + 2 * i * this.radius
			})
		}
	},

	draw(ctx) {
		for (let i = 0; i < this.parts.length; i++) {
			const is_head = i == 0
			const is_tail = i == this.parts.length-1

			let radius = this.radius
			let color = this.color
			// For variation, draw the head and tail a little bigger/smaller
			if (is_head) {
				color = '#000000'
				radius = this.head_radius
			}
			if (is_tail) {
				radius *= 0.7
			}
			const x = this.parts[i].x
			const y = this.parts[i].y
			ctx.fillStyle = color
			ctx.beginPath()
			ctx.arc(
				x,
				y,
				radius,
				0, 2 * Math.PI
			)
			// For a more "wormy" look, draw extra sections between the main ones
			if (!is_head) {
				const px = this.parts[i-1].x
				const py = this.parts[i-1].y

				const dx = x - px
				const dy = y - py

				const angle = Math.atan2(dy, dx)

				const nx = 2 * radius*0.5 * Math.cos(angle) + px
				const ny = 2 * radius*0.5 * Math.sin(angle) + py
				ctx.arc(
					nx,
					ny,
					radius*0.7,
					0, 2 * Math.PI
				)
			}
			ctx.closePath()
			ctx.fill()
		}
	},
	eatFood() {
		this.parts.push({x: 0, y: 0}) // Automatically adjusted by setBody()
		this.velocity += 10
	},
	getHead() {
		return this.parts[0]
	},
	// Sets the snake head to a new point
	setHead(x, y) {
		this.parts[0].x = x
		this.parts[0].y = y
		this.setBody()
	},
	// Sets the positions of the rest of the body
	setBody() {
		for (let i = 1; i < this.parts.length; i++) {
			const is_head = i == 0
			const is_tail = i == this.parts.length-1

			let radius = this.radius
			if (is_head) {
				radius = this.head_radius
			}
			if (is_tail) {
				radius *= 0.7
			}

			const prev = this.parts[i - 1]
			const cur = this.parts[i]

			const dx = cur.x - prev.x
			const dy = cur.y - prev.y

			const angle = Math.atan2(dy, dx)

			const nx = 2 * radius * Math.cos(angle)
			const ny = 2 * radius * Math.sin(angle)

			cur.x = nx + prev.x
			cur.y = ny + prev.y
		}
	},

	setDirection(str) {
		this.dir = str
		const max = Math.max(this.bounds.width,this.bounds.height)
		const head = this.getHead()
		if (str === "left") {
			this.aim.x = -max
			this.aim.y = head.y
		} else if (str == "up") {
			this.aim.x = head.x
			this.aim.y = -max
		} else if (str == "right") {
			this.aim.x = 2*max
			this.aim.y = head.y
		} else if (str == "down") {
			this.aim.x = head.x
			this.aim.y = 2*max
		}
	},

	hit(obj) {
		// NOTE No special case for the tail
		if (this.hitHead(obj)) {
			return true
		}
		for (let i = 1; i < this.parts.length; i++) {
			const part = this.parts[i]
			if ((obj.x - part.x) * (obj.x - part.x) + (obj.y - part.y) * (obj.y - part.y) <= this.radius * this.radius) {
				return true
			}
		}
		return false
	},

	hitHead(obj) {
		const head = this.getHead()
		if ((obj.x - head.x) * (obj.x - head.x) + (obj.y - head.y) * (obj.y - head.y) <= this.head_radius * this.head_radius * 1.2) {
			return true
		}
		return false
	},

	hitBody(obj) {
		for (let i = 1; i < this.parts.length; i++) {
			const part = this.parts[i]
			if ((obj.x - part.x) * (obj.x - part.x) + (obj.y - part.y) * (obj.y - part.y) <= this.radius * this.radius) {
				return true
			}
		}
		return false
	},

	update(dT) {
		const head = this.getHead()
		const aim = this.aim
		const velocity = this.velocity
		// Move at equal velocity towards the aim
		const dx = aim.x - head.x
		const dy = aim.y - head.y
		// "Angle of approach"
		const angle = Math.atan2(dy, dx)
		// Decompose velocity into x and y components
		const xVelocity = velocity * Math.cos(angle)
		const yVelocity = velocity * Math.sin(angle)
		const nx = head.x + xVelocity * dT
		const ny = head.y + yVelocity * dT
		this.setHead(nx,ny)
	},
}
