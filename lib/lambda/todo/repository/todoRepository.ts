// import * as AWS from 'aws-sdk'
import {
  DeleteItemCommand,
  DeleteItemInput,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  PutItemInput,
} from '@aws-sdk/client-dynamodb'

const REGION = 'ap-northeast-1'
const TODO_MASTER_TABLE_NAME = process.env.TODO_MASTER_TABLE_NAME ?? ''
const dbClient = new DynamoDBClient({ region: REGION })

interface Todo {
  userId: string
  todoId: string
  content: string
  done: boolean
}

export class TodoRepository {
  constructor() {}

  public async getTodoList(userId: string) {
    const command = new GetItemCommand({
      Key: { userId: { S: userId } },
      TableName: TODO_MASTER_TABLE_NAME,
    })
    console.log(dbClient)
    const result = await dbClient.send(command)
    console.log(result)
    return result
  }

  public async updateTodo(todo: Todo) {
    const params: PutItemInput = {
      Item: {
        userId: { S: todo.userId },
        todoId: { S: todo.todoId },
        content: { S: todo.content },
        done: { BOOL: todo.done },
      },
      TableName: TODO_MASTER_TABLE_NAME,
    }
    await dbClient.send(new PutItemCommand(params))
  }

  public async deleteTodo(userId: string, todoId: string) {
    const params: DeleteItemInput = {
      Key: {
        userId: { S: userId },
        todoId: { S: todoId },
      },
      TableName: TODO_MASTER_TABLE_NAME,
    }
    await dbClient.send(new DeleteItemCommand(params))
  }
}
