import { ScoreRepository } from './ScoreRepository'

const ScoreClient = new ScoreRepository()
export const handler = async function () {
  let result
  try {
    result = await ScoreClient.getTopScores()
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: true }),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  }
}
