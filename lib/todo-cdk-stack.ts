import { App, Stack, StackProps } from 'aws-cdk-lib'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager'
import * as ssm from 'aws-cdk-lib/aws-ssm'
import { TodoConstructor } from './todoConstructor'

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
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
        statusCode: 200
      },
      
    })

    new TodoConstructor(this)
  }
}
