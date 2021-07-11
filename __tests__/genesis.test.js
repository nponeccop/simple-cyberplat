const axios = require('axios')
const fsp = require('fs').promises
const { Genesis } = require('../index')
jest.mock('axios')

test('should return something', async () => {
  const answer = { RESULT: '1', ERROR: '3' }
  const response = { RESULT: '1', ERROR: '3' }
  // axios.post.mockResolvedValue(response)

  const transport = new Genesis({
    defaultFields: {
      AP: 1111
    },
    provider: {
      url: 'https://predproc.tothemars.io/pay'
    },
    crypto: {
      key: await fsp.readFile('../simple-cyberplat/secret/key.pem', 'utf-8'),
      passphrase: ''
    }
  })

  axios.request.mockResolvedValue(response)
  const result = await transport.request({
    REQ_TYPE: 12
  })

  expect(result).toEqual(answer)
})
