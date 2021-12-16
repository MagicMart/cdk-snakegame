// Load the AWS SDK for Node.js
import { DynamoDB } from 'aws-sdk'

export class ScoreRepository extends DynamoDB.DocumentClient {
  constructor() {
    super()
  }

  getTopScores(): Promise<any> {
    const params: DynamoDB.DocumentClient.AttributeValue = {
      TableName: process.env.TABLE_NAME!,
      IndexName: 'score-index',
      KeyConditionExpression: '#typename = :typename', // this equals "Game = snake game"
      ExpressionAttributeNames: { '#typename': 'Game' },
      ExpressionAttributeValues: { ':typename': 'snake game' },
      ScanIndexForward: false,
      limit: 10,
    }

    return this.query(params).promise()
  }
  updateScore(user: string, score: number): Promise<any> {
    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: process.env.TABLE_NAME!,
      Key: { UserName: user },
      UpdateExpression: 'set BestScore = :score',
      ExpressionAttributeValues: {
        ':score': score,
      },
    }

    return this.update(params).promise()
  }
}
