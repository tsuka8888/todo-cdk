import { TodoRepository } from '../repository/todoRepository'

export type TodoType = {
  id: string
  content: string
  done: boolean
}
export type UpdateTodoType = {
  id: string
  content: string
  done: boolean
}

export class TodoUseCase {
  private repository: TodoRepository

  constructor() {
    this.repository = new TodoRepository()
  }

  public async getTodoList() {
    return await this.repository.getTodoList()
  }
  public async getTodo(id: string) {
    return await this.repository.getTodo(id)
  }
  public async registerTodo(body: TodoType) {
    return await this.repository.postTodo(body)
  }
  public async updateTodo(id: string, body: UpdateTodoType) {
    return await this.repository.putTodo(id, body)
  }
  public async deleteTodo(id: string) {
    return await this.repository.deleteTodo(id)
  }
}
