import { ScoreRepository } from './ScoreRepository'

const ScoreClient = new ScoreRepository()
export const handler = async function (event: any) {
  const user: string = event.pathParameters.user
  const score = Number(event.pathParameters.score)
  let result
  try {
    result = await ScoreClient.updateScore(user, score)
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error }),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'success' }),
  }
}
