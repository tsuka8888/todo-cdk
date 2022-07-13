import { TodoUseCase } from '../usecase/getTodoListUseCase'

export const handler = async (event: any = {}): Promise<any> => {
  const getTodoUseCase = new TodoUseCase()
  const id = event.pathParameters.id
  try {
    const response = await getTodoUseCase.getTodo(id)
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
