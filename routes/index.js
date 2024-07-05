var express = require('express');
var router = express.Router();
const ecpay_payment = require('ecpay_aio_nodejs');

require('dotenv').config()
console.log(process.env) 
// 取出所需的環境變數
const { MERCHANTID, HASH_KEY, HASH_IV, HOST } = process.env

// 設定檔
const options = {
  "OperationMode": "Test", //Test or Production  測試環境 或  正式環境
  "MercProfile": {
    "MerchantID": MERCHANTID,
    "HashKey": HASH_KEY,
    "HashIV": HASH_IV
  },
  "IgnorePayment": [
//    "Credit",
//    "WebATM",
//    "ATM",
//    "CVS",
//    "BARCODE",
//    "AndroidPay"
  ],
  "IsProjectContractor": false
}

let MerchantTradeNo;
let TradeNo;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/checkout', function(req, res, next) {
  // MerchantTradeNo =`1234abc${new Date().getTime()}`
  TradeNo = 'test' + new Date().getTime();
  const MerchantTradeDate = new Date().toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\//g, '/').replace(/,/g, '');
  console.log('MerchantTradeNo', MerchantTradeNo,'\n TradeNo', TradeNo)
  // console.log('MerchantTradeDate', MerchantTradeDate)
  const base_param = {
    MerchantTradeNo: TradeNo, //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
    MerchantTradeDate, //ex: 2017/02/13 15:45:30
    TotalAmount: '100',
    TradeDesc: '測試交易描述',
    ItemName: '測試商品等',
    ReturnURL: `${HOST}/return`,
    // ClientBackURL: 'https://www.google.com',
  }

  let create = new ecpay_payment(options)
  // const htm = create.payment_client.aio_check_out_all(parameters = base_param, invoice = inv_params)
  const html = create.payment_client.aio_check_out_all(base_param)
  // console.log('html =>',html)
  // 將 html 帶進 checkout.ejs 頁面
  res.render('checkout', { title: 'Express' , html });
})


module.exports = router;


// .post('/return', function(req,res,next) {
//   console.log('req.body => ',req.body);
//   send('1/OK')
// })