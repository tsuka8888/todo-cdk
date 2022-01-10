import * as AWS from "aws-sdk"
const db = new AWS.DynamoDB.DocumentClient()

export class UserRepository {
  private tableName = ""

  constructor() {
    this.tableName = process.env.TABLE_NAME || ""
  }

  public async getUserList() {
    const params = {
      TableName: this.tableName,
    }
    const response = await db.scan(params).promise()
    return response
  }

  public async getUserDetail(id: string) {
    const params = {
      TableName: this.tableName,
      Key: { id },
    }
    const response = await db.get(params).promise()
    return response
  }

  public async postUser(body: any) {
    const params = {
      TableName: this.tableName,
      Item: {
        id: body.id,
        firstName: body.firstName,
        lastName: body.lastName,
        nickName: body.nickName,
        email: body.email,
      },
    }
    console.log("params", params)
    await db.put(params).promise()
  }
}
