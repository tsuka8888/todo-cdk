import { TodoUseCase } from '../usecase/getTodoListUseCase'

export const handler = async (event: any = {}): Promise<any> => {
  console.log({ event })
  const todoUseCase = new TodoUseCase()
  try {
    const body = JSON.parse(event.body)
    const response = await todoUseCase.registerTodo(body)
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
