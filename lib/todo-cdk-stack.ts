import { App, Stack, StackProps } from 'aws-cdk-lib'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager'
import * as ssm from 'aws-cdk-lib/aws-ssm'
import { TodoConstructor } from './constructor/todo/todoConstructor'

export class TodoCdkStack extends Stack {
  readonly agw: apigateway.RestApi

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    const domainName = ssm.StringParameter.valueForStringParameter(
      this,
      'api_domain_name'
    )
    const domainCertificationArn = ssm.StringParameter.valueForStringParameter(
      this,
      'api_domain_certification_arn'
    )
    const certificate = Certificate.fromCertificateArn(
      this,
      'certificate',
      domainCertificationArn
    )

    this.agw = new apigateway.RestApi(this, 'todoApi', {
      restApiName: 'Todo API',
      domainName: {
        domainName,
        certificate,
      },
    })

    new TodoConstructor(this)
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
