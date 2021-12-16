import {
  aws_dynamodb as dynamo,
  aws_apigateway as apigw,
  aws_lambda as lambda,
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { aws_s3 as s3 } from 'aws-cdk-lib'

export class ApiDynamoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const bucket = new s3.Bucket(this, 'ApiDynamoBucket', {
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    })

    const table = new dynamo.Table(this, 'ScoreboardTable', {
      partitionKey: { name: 'UserName', type: dynamo.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    })

    table.addGlobalSecondaryIndex({
      indexName: 'score-index',
      partitionKey: { name: 'Game', type: dynamo.AttributeType.STRING },
      sortKey: { name: 'BestScore', type: dynamo.AttributeType.NUMBER },
      projectionType: dynamo.ProjectionType.ALL,
    })
    // defines an AWS Lambda resource
    const topScores = new lambda.Function(this, 'TopScoresHandler', {
      runtime: lambda.Runtime.NODEJS_14_X, // execution environment
      code: lambda.Code.fromAsset('lambda'), // code loaded from "lambda" directory
      handler: 'topscores.handler', // file is "hello", function is "handler"
      environment: {
        TABLE_NAME: table.tableName,
      },
    })
    const updateScore = new lambda.Function(this, 'UpdateScoreHandler', {
      runtime: lambda.Runtime.NODEJS_14_X, // execution environment
      code: lambda.Code.fromAsset('lambda'), // code loaded from "lambda" directory
      handler: 'updateScore.handler', // file is "hello", function is "handler"
      environment: {
        TABLE_NAME: table.tableName,
      },
    })

    // grant read/write permissions to the table
    table.grantReadData(topScores)
    table.grantReadWriteData(updateScore)

    // defines an API Gateway REST API resource backed by our "hello" function.
    // new apigw.LambdaRestApi(this, 'Endpoint', {
    //   handler: hello,
    // });
    const api = new apigw.RestApi(this, 'Endpoint2', {
      restApiName: 'ApiDynamo',
    })
    api.root
      .resourceForPath('/scoreboard/topscores')
      .addMethod('GET', new apigw.LambdaIntegration(topScores))
    api.root
      .resourceForPath('/scoreboard/{user}/updatescore/{score}')
      .addMethod('PUT', new apigw.LambdaIntegration(updateScore))
  }
}
