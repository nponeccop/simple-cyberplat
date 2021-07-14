const axios = require('axios')
const fsp = require('fs').promises
const { Genesis } = require('../index')
jest.mock('axios')

/** Genesis setup and request  */
async function requestBoilerplate (requestBody) {
  const key = await fsp.readFile('secret/privateKey.pem', 'utf-8')
  return await new Genesis({
    defaultFields: {
      AP: 1111
    },
    provider: {
      url: 'https://predproc.tothemars.io/pay'
    },
    crypto: {
      key,
      passphrase: ''
    }
  }).request(requestBody)
}

afterEach(() => {
  jest.restoreAllMocks()
})

test('utf8-win1251 transcoding', async () => {
  axios.request.mockImplementationOnce(async (axiosConf) => {
    expect(axiosConf).toMatchSnapshot()
    // rawResponse is a Windows 1251 BLOB/Buffer, not a string! Thus a file
    const rawResponse = await fsp.readFile('__tests__/testData/response1.txt')
    return axiosConf.transformResponse(rawResponse)
  })
  const result = await requestBoilerplate({
    REQ_TYPE: 'мама мыла раму'
  })
  expect(axios.request).toHaveBeenCalledTimes(1)
  expect(result).toMatchSnapshot()
})
