import { EventListener } from './EventListener'
import { Status, Task } from "./Task";
import { TaskCollection } from "./TaskCollection";
import { TaskRederer } from "./TaskRenderer";

class Application {
	private readonly eventListener = new EventListener()
	private readonly taskCollection = new TaskCollection()
	private readonly taskRenderer = new TaskRederer(
		document.getElementById('todoList') as HTMLElement,
		document.getElementById('doingList') as HTMLElement,
		document.getElementById('doneList') as HTMLElement,
	)

	start() {
		const createForm = document.getElementById('createForm') as HTMLElement

		this.eventListener.add('submit-handler', 'submit', createForm, this.handleSubmit)
		this.taskRenderer.subscribeDragAndDrop(this.handleDropAndDrop)
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

	private handleDropAndDrop = (el: Element, sibling: Element | null, newStatus: Status) => {
		const taskId = this.taskRenderer.getId(el)

		if (!taskId) return

		console.log('taskId', taskId)
		console.log('sibling', sibling)
		console.log('newStatus', newStatus)
		const task = this.taskCollection.find(taskId)

		if (!task) return

		task.update({status: newStatus})
		this.taskCollection.update(task)

		console.log(sibling)
	}
}

window.addEventListener('load', () => {
	const app = new Application()
	app.start()
})