const axios = require("axios").default; // npm install axios
const CryptoJS = require("crypto-js"); // npm install crypto-js
const moment = require("moment"); // npm install moment
const {v4} = require("uuid")




exports.payment = (req, res) => {
    const {dataList, amount, redirectUrl} = req.body
    const ZALO_PAY_CONFIG = {
        app_id: "2554",
        key1: process.env.KEY1_ZALO,
        key2: process.env.KEY2_ZALO,
        endpoint: "https://sb-openapi.zalopay.vn/v2/create",
        callback_url: "http://localhost:8000/api/payment/callback",
    };
    
    const embed_data = {
        redirecturl: redirectUrl,
    };
    
    const transID = v4();
    const order = {
        app_id: ZALO_PAY_CONFIG.app_id,
        app_trans_id: `${moment().format("YYMMDD")}_${transID.slice(0, transID.length -10)}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
        app_user: "glassmanagement45",
        app_time: Date.now(), // miliseconds
        item: JSON.stringify(dataList),
        embed_data: JSON.stringify(embed_data),
        amount: amount,
        description: `GlassVT - Payment for the order #${transID}`,
    };
    
    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
        ZALO_PAY_CONFIG.app_id +
        "|" +
        order.app_trans_id +
        "|" +
        order.app_user +
        "|" +
        order.amount +
        "|" +
        order.app_time +
        "|" +
        order.embed_data +
        "|" +
        order.item;
    order.mac = CryptoJS.HmacSHA256(data, ZALO_PAY_CONFIG.key1).toString();
    
    axios
        .post(ZALO_PAY_CONFIG.endpoint, null, { params: order })
        .then((respose) => {
            console.log(respose.data);
            return res.status(200).json(respose.data)
        })
        .catch((err) => console.log(err));
};



exports.afterPayment = (req, res) => {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, ZALO_PAY_CONFIG.key2).toString();
    console.log("mac =", mac);


    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    }
    else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, ZALO_PAY_CONFIG.key2);
      console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
};