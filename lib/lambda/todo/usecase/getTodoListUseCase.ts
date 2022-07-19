import { DeleteTodoRequest } from '../handler/delete-todo'
import { GetTodoListRequest, GetTodoListResponse } from '../handler/get-todo-list'
import { UpdateTodoRequest } from '../handler/update-todo'
import { TodoRepository } from '../repository/todoRepository'

export class TodoUseCase {
  private repository: TodoRepository

  constructor() {
    this.repository = new TodoRepository()
  }

  public async getTodoList({ userId }: GetTodoListRequest): Promise<GetTodoListResponse> {
    if (userId === '') throw new Error('入力項目に誤りがあります。')
    return await this.repository.getTodoList(userId)
  }
  public async updateTodo(todo: UpdateTodoRequest) {
    return await this.repository.updateTodo(todo)
  }
  public async deleteTodo({ userId, todoId }: DeleteTodoRequest) {
    return await this.repository.deleteTodo(userId, todoId)
  }
}
