import { TodoUseCase } from '../usecase/getTodoListUseCase'

export interface UpdateTodoRequest {
  userId: string
  todoId: string
  content: string
  done: boolean
}

export const handler = async (event: UpdateTodoRequest) => {
  console.log('event', event)
  const todoUseCase = new TodoUseCase()
  try {
    const result = await todoUseCase.updateTodo(event)
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    }
  }
}
