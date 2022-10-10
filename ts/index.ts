import { sum } from './sum'

console.log(sum(1, 2))

class Application {
	start() {
		console.log("Hello, wourld!")
	}
}

window.addEventListener('load', () => {
	const app = new Application()
	app.start()
})