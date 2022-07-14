// import * as AWS from 'aws-sdk'
import {
  DeleteItemCommand,
  DeleteItemInput,
  DynamoDBClient,
  PutItemCommand,
  PutItemInput,
  QueryCommand,
  QueryInput,
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
    const params: QueryInput = {
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': { S: userId } },
      ProjectionExpression: 'userId, todoId, content, done',
      TableName: TODO_MASTER_TABLE_NAME,
    }
    const result = await await dbClient.send(new QueryCommand(params))
    return result.Items
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
