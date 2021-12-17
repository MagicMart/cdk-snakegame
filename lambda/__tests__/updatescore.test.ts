import { handler } from '../updateScore'

jest.mock('../ScoreRepository', () => ({
  ScoreRepository: jest.fn().mockImplementation(() => {
    return {
      updateScore: jest
        .fn()
        .mockResolvedValueOnce('success')
        .mockRejectedValueOnce('Something went wrong'),
    }
  }),
}))

describe('updatescore', () => {
  it('should return an error when event.body is undefined', async () => {
    const result = await handler({})
    expect(result).toEqual({
      statusCode: 400,
      body: JSON.stringify({ error: true, message: 'Invalid request' }),
    })
  })
  it('should return an error if score is not a number', async () => {
    const result = await handler({
      body: JSON.stringify({ user: 'user', score: 'not a number' }),
    })
    expect(result).toEqual({
      statusCode: 400,
      body: JSON.stringify({
        error: true,
        message: 'score must be an integer',
      }),
    })
  })
  it('should retutn an error if user is missing', async () => {
    const result = await handler({
      body: JSON.stringify({ score: 10 }),
    })
    expect(result).toEqual({
      statusCode: 400,
      body: JSON.stringify({
        error: true,
        message: 'Missing user',
      }),
    })
  })
  it("should update a user's score", async () => {
    const event = {
      pathParameters: {
        user: 'mart',
      },
      body: JSON.stringify({ score: 10, user: 'mart' }),
    }
    const result = await handler(event)
    expect(result).toEqual({
      body: '{"message":"success"}',
      statusCode: 200,
    })
  })
  it('should return an error message', async () => {
    const event = {
      pathParameters: {
        user: 'mart',
      },
      body: JSON.stringify({ score: 10, user: 'mart' }),
    }
    const result = await handler(event)
    expect(result).toEqual({
      statusCode: 500,
      body: '{"error":"Something went wrong"}',
    })
  })
})
