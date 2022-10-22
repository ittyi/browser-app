import { EventListener } from './EventListener'
import { Task } from "./Task";
import { TaskCollection } from "./TaskCollection";
import { TaskRederer } from "./TaskRenderer";

class Application {
	private readonly eventListener = new EventListener()
	private readonly taskCollection = new TaskCollection()
	private readonly taskRenderer = new TaskRederer(
		document.getElementById('todoList') as HTMLElement
	)

	start() {
		const createForm = document.getElementById('createForm') as HTMLElement

		this.eventListener.add('submit-handler', 'submit', createForm, this.handleSubmit)
	}

	private handleSubmit = (e: Event) => {
		e.preventDefault()
		console.log('submitted')

		const titleInput = document.getElementById('title') as HTMLInputElement

		if (!titleInput.value) return

		const task = new Task({ title: titleInput.value})
		console.log(task)
		this.taskCollection.add(task)
		console.log(this.taskCollection)
		// this.taskRenderer.append(task)
		const { deleteButtonEl } = this.taskRenderer.append(task)

		this.eventListener.add(
			task.id,
			'click',
			deleteButtonEl,
			() => this.handleClickDeleteTask(task)
		)

		titleInput.value = ''
	}

	private handleClickDeleteTask = (task: Task) => {
		if (!window.confirm(`「${task.title}を削除してよろしいですか？」`)) return

		console.log(task)
		this.eventListener.remove(task.id)

		this.taskCollection.delete(task)
		console.log('taskCollection:', this.taskCollection)

		this.taskRenderer.remove(task)
	}
}

window.addEventListener('load', () => {
	const app = new Application()
	app.start()
})