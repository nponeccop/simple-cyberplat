const axios = require('axios')
const fsp = require('fs').promises
const { Genesis, requestFromObj, responseToObj } = require('../index')
jest.mock('axios')

// init genesis client
async function getGenesis () {
  return new Genesis({
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
}

describe('genesis.request', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    // config for mocking axios
    const response = { RESULT: '1', ERROR: '3' }
    // mock axios return value
    axios.request.mockResolvedValue(response)
  })
  // need to think about proper names for tests
  test('axios should be called with certain data', async () => {
    // config for mocking axios
    const answer = { RESULT: '1', ERROR: '3' }
    // config for data which axios should be called with
    const data = requestFromObj({ AP: 1111, REQ_TYPE: 12 })
    // get genesis client
    const transport = await getGenesis()
    // actual call
    const result = await transport.request({
      REQ_TYPE: 12
    })
    // use expect.objectContaining to check if certain data exists in request object
    expect(axios.request).toHaveBeenCalledWith(expect.objectContaining({ data }))
    expect(axios.request).toHaveBeenCalledTimes(1)
    expect(result).toEqual(answer)
  })

  test('axios return value should be decoded', async () => {
    const answer = { RESULT: '1', ERROR: '3' }
    const encodedAnswer = requestFromObj(answer)
    const decodedAnswer = responseToObj(encodedAnswer)
    // prepare variable for a func
    let transformResponse
    // create spy
    jest.spyOn(axios, 'request').mockImplementationOnce((options) => {
      // assign transformResponse function from the actual call config
      transformResponse = options.transformResponse
      // why return promise?(i get it from stackoverflow example) it works fine without it
      // return Promise.resolve({})
    })

    // get genesis client
    const transport = await getGenesis()
    // actual call
    await transport.request({
      REQ_TYPE: 12
    })
    // maybe this is an unnecessary call
    expect(axios.request).toBeCalled()
    // get decoded response with the transformResponse function from the config of the axios.request call
    const response = transformResponse(encodedAnswer)
    // check response
    expect(response).toEqual(decodedAnswer)
    // it is called two times because there are two tests
    // i need to find a way to isolate calls
    expect(axios.request).toBeCalledTimes(2)
  })
})
