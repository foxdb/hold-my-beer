import hello from './hello'

test('hello handler returns 200', async () => {
  const response = await hello({}, {})
  expect(response.statusCode).toBe(200)
  expect(JSON.parse(response.body).message).toBe('Hello from HMB API!')
})
