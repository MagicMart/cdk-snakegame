import { ScoreRepository } from './ScoreRepository';

const ScoreClient = new ScoreRepository();
exports.handler = async function (event: any) {
  const path = event.path;

  const query = event.queryStringParameters;

  const result = await ScoreClient.getTopScores().catch((err) =>
    console.log('ERROR', err)
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: result.Items,
    }),
  };
};
