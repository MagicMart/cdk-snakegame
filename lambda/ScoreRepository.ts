// Load the AWS SDK for Node.js
import { DynamoDB } from 'aws-sdk'

export interface TopScoreParams {
  TableName: string
  IndexName: string
  KeyConditionExpression: string
  ExpressionAttributeNames: any
  ExpressionAttributeValues: any
  ScanIndexForward: boolean
  limit: number
}

export class ScoreRepository extends DynamoDB.DocumentClient {
  constructor() {
    super()
  }

  getTopScores(): Promise<any> {
    const params: TopScoreParams = {
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
}
