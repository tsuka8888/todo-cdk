import * as AWS from 'aws-sdk'
const db = new AWS.DynamoDB.DocumentClient()

export class TodoRepository {
  private TABLE_NAME: string

  constructor() {
    this.TABLE_NAME = process.env.TABLE_NAME || ''
  }

  public async getTodoList() {
    const params = {
      TableName: this.TABLE_NAME,
    }
    return await db.scan(params).promise()
  }

  public async getTodo(id: string) {
    const params = {
      TableName: this.TABLE_NAME,
      Key: { id },
    }
    return await db.get(params).promise()
  }

  public async postTodo(body: any) {
    const params = {
      TableName: this.TABLE_NAME,
      Item: {
        id: body.id,
        content: body.content,
        done: body.done,
      },
    }
    return await db.put(params).promise()
  }

  public async putTodo(id: string, body: any) {
    const params = {
      TableName: this.TABLE_NAME,
      Key: { id },
      UpdateExpression:
        'set info.id = :id, info.content=:content, info.done=:done',
      ExpressionAttributeValues: {
        ':id': id,
        ':content': body.content,
        ':done': body.id,
      },
    }
    return await db.update(params).promise()
  }

  public async deleteTodo(id: string) {
    const params = {
      TableName: this.TABLE_NAME,
      Key: { id },
    }
    return await db.delete(params).promise()
  }
}
