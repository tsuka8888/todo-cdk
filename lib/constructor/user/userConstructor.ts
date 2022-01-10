import * as apigateway from '@aws-cdk/aws-apigateway'
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import * as lambda from '@aws-cdk/aws-lambda'
import { AssetCode, Runtime } from '@aws-cdk/aws-lambda'
import * as cdk from '@aws-cdk/core'
import { addCorsOptions, TodoCdkStack } from '../../todo-cdk-stack'

export class UserConstructor {
  constructor(scope: TodoCdkStack) {

    const table = new dynamodb.Table(scope, 'Users', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    })

    const lambdaOptions = {
      code: new AssetCode('lib/lambda/user'),
      runtime: Runtime.NODEJS_14_X,
      environment: {
        TABLE_NAME: table.tableName,
      },
    }

    // 一覧取得lambda
    const getUserListLambda = new lambda.Function(scope, 'getUserListLambda', {
      ...lambdaOptions,
      handler: '/handler/get-user-list.handler',
    })
    // 詳細取得Lambda
    const getUserDetailLambda = new lambda.Function(
      scope,
      'getUserDetailLambda',
      {
        ...lambdaOptions,
        handler: '/handler/get-user-detail.handler',
      }
    )
    // 登録Lambda
    const postUserLambda = new lambda.Function(scope, 'postUserLambda', {
      ...lambdaOptions,
      handler: '/handler/post-user.handler',
    })
    // 更新Lambda
    const putUserLambda = new lambda.Function(scope, 'putUserLambda', {
      ...lambdaOptions,
      handler: '/handler/put-user.handler',
    })

    table.grantReadWriteData(getUserListLambda)
    table.grantReadWriteData(getUserDetailLambda)
    table.grantReadWriteData(postUserLambda)
    table.grantReadWriteData(putUserLambda)

    // endpoint/users
    const users = scope.agw.root.addResource('users')
    users.addMethod('GET', new apigateway.LambdaIntegration(getUserListLambda))
    users.addMethod('POST', new apigateway.LambdaIntegration(postUserLambda))
    addCorsOptions(users)

    const usersPathId = users.addResource('{id}')
    usersPathId.addMethod(
      'GET',
      new apigateway.LambdaIntegration(getUserDetailLambda)
    )
    usersPathId.addMethod(
      'PUT',
      new apigateway.LambdaIntegration(putUserLambda)
    )
    addCorsOptions(usersPathId)
  }
  
}
