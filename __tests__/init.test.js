/*
add to package.json
"standard": {
    "env": [
      "jest"
    ]
  }
 */
const axios = require('axios')

jest.mock('axios')

test('should return - success', () => {
  expect('success').toEqual('success')
})

test('should return 0', () => {
  const answer = 0
  const response = 0

  async function testAxios () {
    return await axios.get('someurl')
  }

  axios.get.mockResolvedValue(response)

  return testAxios().then((data) => expect(data).toEqual(answer))
})
