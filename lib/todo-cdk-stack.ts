import * as cdk from '@aws-cdk/core'
import * as apigateway from '@aws-cdk/aws-apigateway'
import { TodoConstructor } from './constructor/todo/todoConstructor'
import { UserConstructor } from './constructor/user/userConstructor'

export class TodoCdkStack extends cdk.Stack {
  readonly agw: apigateway.RestApi

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    this.agw = new apigateway.RestApi(this, 'todoApi', {
      restApiName: 'Todo API',
    })

    new TodoConstructor(this)
    new UserConstructor(this)
  }
}

export function addCorsOptions(apiResource: apigateway.IResource) {
  apiResource.addMethod(
    'OPTIONS',
    new apigateway.MockIntegration({
      integrationResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers':
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Credentials':
              "'false'",
            'method.response.header.Access-Control-Allow-Methods':
              "'OPTIONS,GET,PUT,POST,DELETE'",
          },
        },
      ],
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
        'application/json': '{"statusCode": 200}',
      },
    }),
    {
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Methods': true,
            'method.response.header.Access-Control-Allow-Credentials': true,
            'method.response.header.Access-Control-Allow-Origin': true,
          },
        },
      ],
    }
  )
}
