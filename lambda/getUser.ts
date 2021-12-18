import { ScoreRepository } from './ScoreRepository'

const ScoreClient = new ScoreRepository()

export const handler = async function (event: any) {
  let result
  const user = event.pathParameters.user
  try {
    result = await ScoreClient.getUserByUserName(user)
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error }),
    }
  }

  if (!result.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'User not found' }),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item),
  }
}
