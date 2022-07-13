import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import { addCorsOptions, TodoCdkStack } from '../../todo-cdk-stack'

export class TodoConstructor {
  constructor(scope: TodoCdkStack) {
    const todoMaster = new dynamodb.Table(scope, 'todoMaster', {
      tableName: 'todoMaster',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'todoId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    })

    const lambdaOptions = {
      code: new lambda.AssetCode('lib/lambda/todo'),
      runtime: lambda.Runtime.NODEJS_14_X,
      environment: {
        TODO_MASTER_TABLE_NAME: todoMaster.tableName,
      },
    }

    // 一覧取得lambda
    const getTodoListLambda = new lambda.Function(scope, 'getTodoListLambda', {
      ...lambdaOptions,
      handler: 'handler/get-todo-list.handler',
    })
    const updateTodoLambda = new lambda.Function(scope, 'updateTodoLambda', {
      ...lambdaOptions,
      handler: 'handler/post-todo.handler',
    })
    const deleteTodoLambda = new lambda.Function(scope, 'deleteTodoLambda', {
      ...lambdaOptions,
      handler: 'handler/delete-todo.handler',
    })

    todoMaster.grantReadWriteData(getTodoListLambda)
    todoMaster.grantReadWriteData(updateTodoLambda)
    todoMaster.grantReadWriteData(deleteTodoLambda)

    const todos = scope.agw.root.addResource('todos')
    todos.addMethod(
      'GET',
      new apigateway.LambdaIntegration(getTodoListLambda, {
        requestTemplates: {
          'application/json':
            '{ "userId": "$method.request.querystring.userId" }',
        },
      })
    )
    todos.addMethod(
      'POST',
      new apigateway.LambdaIntegration(updateTodoLambda, {
        requestTemplates: {
          'application/json':
            '{ "userId": $input.json("$.userId"), "todoId": $input.json("$.todoId"), "content": $input.json("$.content"), "done": $input.json("$.done") }',
        },
      })
    )
    todos.addMethod(
      'DELETE',
      new apigateway.LambdaIntegration(deleteTodoLambda, {
        requestTemplates: {
          'application/json':
            '{ "userId": $input.json("$.userId"), "todoId": $input.json("$.todoId") }',
        },
      })
    )
    addCorsOptions(todos)
  }
}
