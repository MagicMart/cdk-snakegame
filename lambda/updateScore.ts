import { ScoreRepository } from './ScoreRepository'

const ScoreClient = new ScoreRepository()
export const handler = async function (event: any) {
  if (!event.body)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: true, message: 'Invalid request' }),
    }

  const body = JSON.parse(event.body)
  const score = Number(body.score)
  if (!Number.isInteger(score)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: true,
        message: 'score must be an integer',
      }),
    }
  }

  const user = body.user

  if (!user) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: true,
        message: 'Missing user',
      }),
    }
  }
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
