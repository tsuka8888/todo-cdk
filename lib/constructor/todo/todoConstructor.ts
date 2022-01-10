import * as cdk from '@aws-cdk/core'
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import * as lambda from '@aws-cdk/aws-lambda'
import * as apigateway from '@aws-cdk/aws-apigateway'
import { addCorsOptions, TodoCdkStack } from '../../todo-cdk-stack'

export class TodoConstructor {
  constructor(scope: TodoCdkStack) {
    const table = new dynamodb.Table(scope, 'todoTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    })

    const lambdaOptions = {
      code: new lambda.AssetCode('lib/lambda/todo'),
      runtime: lambda.Runtime.NODEJS_14_X,
      environment: {
        TABLE_NAME: table.tableName,
      },
    }

    // 一覧取得lambda
    const getTodoListLambda = new lambda.Function(scope, 'getTodoListLambda', {
      ...lambdaOptions,
      handler: 'handler/get-todo-list.handler',
    })
    const getTodoLambda = new lambda.Function(scope, 'getTodoLambda', {
      ...lambdaOptions,
      handler: 'handler/get-todo.handler',
    })
    const postTodoLambda = new lambda.Function(scope, 'postTodoLambda', {
      ...lambdaOptions,
      handler: 'handler/post-todo.handler',
    })
    const putTodoLambda = new lambda.Function(scope, 'putTodoLambda', {
      ...lambdaOptions,
      handler: 'handler/put-todo.handler',
    })
    const deleteTodoLambda = new lambda.Function(scope, 'deleteTodoLambda', {
      ...lambdaOptions,
      handler: 'handler/delete-todo.handler',
    })

    table.grantReadWriteData(getTodoListLambda)
    table.grantReadWriteData(getTodoLambda)
    table.grantReadWriteData(postTodoLambda)
    table.grantReadWriteData(putTodoLambda)
    table.grantReadWriteData(deleteTodoLambda)

    const todos = scope.agw.root.addResource('todos')
    todos.addMethod('GET', new apigateway.LambdaIntegration(getTodoListLambda))
    todos.addMethod('POST', new apigateway.LambdaIntegration(postTodoLambda))
    addCorsOptions(todos)

    const todosWithId = todos.addResource('{id}')
    todosWithId.addMethod(
      'GET',
      new apigateway.LambdaIntegration(getTodoLambda)
    )
    todosWithId.addMethod(
      'PUT',
      new apigateway.LambdaIntegration(putTodoLambda)
    )
    todosWithId.addMethod(
      'DELETE',
      new apigateway.LambdaIntegration(deleteTodoLambda)
    )
    addCorsOptions(todosWithId)
  }
}
