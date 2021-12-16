import { ScoreRepository } from '../ScoreRepository'
import { handler } from '../topscores'

jest.mock('../../lambda/ScoreRepository', () => ({
  ScoreRepository: jest.fn().mockImplementation(() => {
    return {
      getTopScores: jest
        .fn()
        .mockResolvedValueOnce({
          Items: [
            {
              Game: 'snake game',
              Score: 10,
              UserName: 'user1',
            },
            {
              Game: 'snake game',
              Score: 20,
              UserName: 'user2',
            },
          ],
        })
        .mockRejectedValueOnce('error'),
    }
  }),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

describe('top', () => {
  it('should return the top scores', async () => {
    const result = await handler()
    expect(result).toEqual({
      body: '[{"Game":"snake game","Score":10,"UserName":"user1"},{"Game":"snake game","Score":20,"UserName":"user2"}]',
      statusCode: 200,
    })
  })
  it('should return an error message', async () => {
    const result = await handler()
    expect(result).toEqual({
      statusCode: 500,
      body: '{"error":true}',
    })
  })
})
