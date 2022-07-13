import { TodoUseCase } from '../usecase/getTodoListUseCase'

export interface DeleteTodoRequest {
  userId: string
  todoId: string
}

export const handler = async (event: DeleteTodoRequest) => {
  const todoUseCase = new TodoUseCase()
  try {
    const response = await todoUseCase.deleteTodo(event)
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    }
  }
}
