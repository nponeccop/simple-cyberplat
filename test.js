const fs = require('fs');
const randomstring = require("randomstring");
const cp = require('.');

const check_url = 'https://predproc-test.gbsystems.pro/pay'
const pay_url = 'https://predproc-test.gbsystems.pro/pay'
const verify_url = 'https://predproc-test.gbsystems.pro/verify'

const CERT = 'XXXXXXXXXXXXXXXXXXXXXXXXXXX';

const SD = 123456;                   // Dealer unique code
const AP = 123466;                      // Acceptance outlet code
const OP = 123354;                      // POS Operator / Cashier code
const sess = randomstring.generate(20);  // Dealer Unique Transaction ID – Alphanumeric (Maximum 20 in length)
const number = "99999999";            // Mobile / DTH Subscriber Number / Consumer Number
const amount = "10";                    // Denomination for recharge
const account = ""                      //For Special Recharges - ‘ACCOUNT=2’


const secKey = fs.readFileSync('./secret/key.pem', 'utf-8')
const passwd = '';


initObj = {
	crypto: {
		secKey: secKey,
		pwd: passwd
	},
	settings: {
		SD: SD,
		AP: AP,
		OP: OP
	},
	provider: {
		payCheck :check_url,
		pay: pay_url, 
		verify: verify_url
	}
}

const cyberplat = cp(initObj);

payload = {
	CERT: CERT,
	SESSION: sess,
	NUMBER: number,
	ACCOUNT: account,
	AMOUNT: amount,
	AMOUNT_ALL: amount,
	COMMENT: 'cool'
}

cyberplat.payCheck(payload, (statusData, err)=> {
	if (statusData == null ) {
//		console.error({ r : Object.keys(err)})
//		console.error({ request : Object.keys(err.request)})
		console.error({ headers : err.request.headers, body: err.body })
		return
	}
	console.log(statusData);
	if (statusData.RESULT === '0') {
		cyberplat.pay(payload, (payData)=> {
			console.log(payData);
		})
	}
});
