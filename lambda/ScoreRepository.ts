// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

// Set the region
// AWS.config.update({ region: 'REGION' });

// Create DynamoDB document client
// var docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

// var params = {
//   TableName: 'EPISODES_TABLE',
//   Key: { KEY_NAME: 'userID' },
// };

// docClient.get(params, function (err, data) {
//   if (err) {
//     console.log('Error', err);
//   } else {
//     console.log('Success', data.Item);
//   }
// });

export class ScoreRepository extends AWS.DynamoDB.DocumentClient {
  constructor() {
    super();
  }

  getTopScores(): Promise<any> {
    console.log('tableName', process.env.TABLE_NAME);
    const params = {
      TableName: process.env.TABLE_NAME,
      IndexName: 'score-index',
      KeyConditionExpression: '#typename = :typename', // this equals "type = hat"
      ExpressionAttributeNames: { '#typename': 'Game' },
      ExpressionAttributeValues: { ':typename': 'snake game' },
      ScanIndexForward: false,
      limit: 10,
    };

    return this.query(params).promise();
  }
}
