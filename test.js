const fsp = require('fs').promises
const { Genesis } = require('./index')

const wrapAsync = f => f().catch(console.log)

wrapAsync(async () => {
  const transport = new Genesis({
    defaultFields: {
      AP: 1111
    },
    provider: {
      url: 'https://predproc.tothemars.io/pay'
    },
    crypto: {
      key: await fsp.readFile('./secret/key.pem', 'utf-8'),
      passphrase: ''
    }
  })

  const result = await transport.request({
    REQ_TYPE: 12
  })
  console.log({ result })
})
