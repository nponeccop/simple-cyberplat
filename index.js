"use strict"
const request = require("request");
const qs = require('qs');
const qsIconv = require('qs-iconv');

const Builder = require('./lib/builder');
const Signature = require('./lib/signature');
const Errors = require('./lib/errors');
const Parser = require('./lib/parser');

const Cyberplat = function (ops) {

  const crypto = ops.crypto;
  const settings = ops.settings;
  const provider = ops.provider;

  const builder = new Builder(settings);
  const signature = new Signature(crypto);
  const parser = new Parser();

  const go = function(type, obj, callback) {
    let url = null;
    console.error({type})
    if (provider[type]) {
      url = provider[type];
    } else {
      callback(true);
      return
    }

    const payload = builder.buildMessage(type, obj);
    const signature_b64 = signature.getSignature(payload)// .match(/.{1,76}/g).join("\r\n");

    const signatureEncoded = encodeURIComponent(signature_b64)

    let headers = {
      'Content-Type': 'text/plain',
      'x-sign' : signatureEncoded
    }
    let options = {
      url,
      method: 'POST',
      headers,
      body: payload
    }

    request(options, function (e, r, body) {
      callback(e, r, parser.stringToObj(body));
    })
  }

  // checking payment before pay
  const payCheck = function (obj, callback) {        
    go('payCheck', obj, callback);
  };

  // paying
  const pay = function (obj, callback) {        
    go('pay', obj, callback);
  };

  // checking payment after pay
  const payStatus = function (obj, callback) {        
    go('payStatus', obj, callback);
  };

  // balance
  const balance = function (obj, callback) {
    go('balance', obj, callback);
  };

  
  /****************************** UPI ******************************/

  // checking payment before pay
  const vpaValidation = function (obj, callback) {        
    go('vpaValidation', obj, callback);
  };

  // paying
  const upiPay = function (obj, callback) {        
    go('upiPay', obj, callback);
  };

  // checking payment after pay
  const upiPayStatus = function (obj, callback) {        
    go('upiPayStatus', obj, callback);
  };

  return {
    payCheck,
    pay,
    payStatus,
    balance,
    Errors,
    vpaValidation,
    upiPay,
    upiPayStatus
  };
}

module.exports = Cyberplat;
