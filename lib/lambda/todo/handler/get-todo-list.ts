import { TodoUseCase } from '../usecase/getTodoListUseCase'

interface Todo {
  userId: string
  todoId: string
  content: string
  done: string
}
export interface GetTodoListRequest {
  userId: string
}
export interface GetTodoListResponse {
  TodoList: Todo[]
}

export const handler = async (event: GetTodoListRequest) => {
  const getTodoListUseCase = new TodoUseCase()

  try {
    const result = await getTodoListUseCase.getTodoList(event)
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: error,
    }
  }
}
