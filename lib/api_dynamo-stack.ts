import {
  aws_dynamodb as dynamo,
  aws_apigateway as apigw,
  aws_lambda as lambda,
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3 as s3 } from 'aws-cdk-lib';

export class ApiDynamoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'ApiDynamoBucket', {
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });
    const table = new dynamo.Table(this, 'ApiDynamoTable', {
      partitionKey: { name: 'userID', type: dynamo.AttributeType.STRING },
      sortKey: { name: 'score', type: dynamo.AttributeType.STRING },
    });

    // defines an AWS Lambda resource
    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_14_X, // execution environment
      code: lambda.Code.fromAsset('lambda'), // code loaded from "lambda" directory
      handler: 'hello.handler', // file is "hello", function is "handler"
    });

    // defines an API Gateway REST API resource backed by our "hello" function.
    // new apigw.LambdaRestApi(this, 'Endpoint', {
    //   handler: hello,
    // });
    const api = new apigw.RestApi(this, 'Endpoint2', {
      restApiName: 'ApiDynamo',
    });
    api.root
      .resourceForPath('/scoreboard/top')
      .addMethod('GET', new apigw.LambdaIntegration(hello));
  }
}
