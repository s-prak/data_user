const CryptoJS = require("crypto-js");

const SECRET_KEY = CryptoJS.enc.Utf8.parse("1234567890abcdef1234567890abcdef"); // 32 bytes
const IV = CryptoJS.enc.Utf8.parse("0000000000000000"); // 16 bytes

const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
};

// Example usage
//console.log("Encrypted:", encrypt("soil"));

module.exports = { encrypt };
