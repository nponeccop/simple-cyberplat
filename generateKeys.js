const { generateKeyPair } = require('crypto')
const fs = require('fs')

// keys are created with delay of 2-4 secs
generateKeyPair('rsa', {
  modulusLength: 1024,
  publicKeyEncoding: {
    type: 'pkcs1',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs1',
    format: 'pem'
    /* this creates encoding key, we don't need this
    cipher: 'aes-256-cbc',
    passphrase: 'top secret'
    */
  }
}, (err, publicKey, privateKey) => {
  if (err) {
    throw err
  }
  fs.writeFile('secret/privateKey.pem', privateKey, (err) => {
    if (err) throw err
    console.log('private key saved')
  })

  fs.writeFile('secret/publicKey.pem', publicKey, (err) => {
    if (err) throw err
    console.log('public key saved')
  })
})
