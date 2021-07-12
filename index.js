'use strict'
const crypto = require('crypto')
const iconv = require('iconv-lite')
const axios = require('axios')

const DELIMITER = '\r\n'

const requestFromObj = obj =>
  iconv.encode(
    Object.keys(obj)
      .map(key => key + '=' + obj[key])
      .join(DELIMITER), 'win1251')

function splitOnFirst (str, sep) {
  const index = str.indexOf(sep)
  return index < 0 ? [str] : [str.slice(0, index), str.slice(index + sep.length)]
}

const responseToObj = message => Object.fromEntries(
  iconv.decode(message, 'win1251')
    .split(DELIMITER)
    .map(x => splitOnFirst(x, '=')))

const getSignature = (payload, cryptoParams) => crypto
  .createSign('RSA-SHA1')
  .update(payload)
  .sign(cryptoParams, 'base64')

class Genesis {
  constructor ({ crypto, provider, defaultFields }) {
    this.provider = provider
    this.crypto = crypto
    this.defaultFields = defaultFields
  }

  async request (obj) {
    const url = this.provider.url
    const newObj = { ...(this.defaultFields), ...obj }
    const data = requestFromObj(newObj)

    return await axios.request({
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain; encoding=windows-1251',
        'x-sign': encodeURIComponent(getSignature(data, this.crypto))
      },
      responseType: 'arraybuffer',
      transformResponse: responseToObj,
      data
    })
  }
}

exports.Genesis = Genesis
exports.requestFromObj = requestFromObj
exports.responseToObj = responseToObj
