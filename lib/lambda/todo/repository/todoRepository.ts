import * as AWS from 'aws-sdk'
import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb'

const REGION = 'ap-northeast-1'
const dbClient = new DynamoDBClient({ region: REGION })

interface Todo {
  userId: string
  todoId: string
  content: string
  done: boolean
}

export class TodoRepository {
  private TODO_TABLE_NAME: string

  constructor() {
    this.TODO_TABLE_NAME = process.env.TABLE_NAME || ''
  }

  public async getTodoList(userId: string) {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId },
      ProjectionExpression: 'userId, todoId, content, done',
      TableName: this.TODO_TABLE_NAME,
    }
    const result = await await dbClient.send(new QueryCommand(params))
    return result.Items
  }

  public async updateTodo(todo: Todo) {
    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      Item: {
        userId: todo.userId,
        todoId: todo.todoId,
        content: todo.content,
        done: todo.done,
      },
      TableName: this.TODO_TABLE_NAME,
    }
    await dbClient.send(new PutItemCommand(params))
  }

  public async deleteTodo(userId: string, todoId: string) {
    const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
      Key: {
        userId,
        todoId,
      },
      TableName: this.TODO_TABLE_NAME,
    }
    await dbClient.send(new DeleteItemCommand(params))
  }
}
