const fsp = require('fs').promises
const { Genesis } = require('./index')

const wrapAsync = f => f().catch(console.log)

const getTransport = async () => {
  try {
    const transport = new Genesis({
      defaultFields: {
        AP: 1111
      },
      provider: {
        url: 'https://predproc.tothemars.io/pay'
      },
      crypto: {
        key: await fsp.readFile('./testKeys/privateKey.pem', 'utf-8'),
        passphrase: ''
      }
    })

    const result = await transport.request({
      REQ_TYPE: 12
    })

    return result.data
  } catch (err) {
    console.log(err)
  }
}

wrapAsync(getTransport)
module.exports = getTransport
