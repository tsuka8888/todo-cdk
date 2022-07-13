import { TodoUseCase, UpdateTodoType } from '../usecase/getTodoListUseCase'

export const handler = async (event: any = {}): Promise<any> => {
  console.log('event', event)
  const todoUseCase = new TodoUseCase()
  const id: string = event.pathParameters.id
  try {
    const body: UpdateTodoType = JSON.parse(event.body)
    const response = await todoUseCase.updateTodo(id, body)
    return {
      statusCode: 200,
      body: JSON.stringify(response),
      headers: { 'Access-Control-Allow-Origin': '*' },
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
      headers: { 'Access-Control-Allow-Origin': '*' },
    }
  }
}
