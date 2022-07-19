import { TodoUseCase } from '../usecase/getTodoListUseCase'

export interface Todo {
  userId: string
  todoId: string
  content: string
  done: boolean
}
export interface GetTodoListRequest {
  userId: string
}
export interface GetTodoListResponse {
  todoList: Todo[]
}

export const handler = async (event: GetTodoListRequest) => {

  const getTodoListUseCase = new TodoUseCase()

  try {
    const result = await getTodoListUseCase.getTodoList(event)
    return result
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: error,
    }
  }
}
