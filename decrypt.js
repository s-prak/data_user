const crypto = require('crypto');

const SECRET_KEY = Buffer.from("1234567890abcdef1234567890abcdef", 'utf-8'); // 32 bytes
const IV = Buffer.from("0000000000000000", 'utf-8'); // 16 bytes

const decrypt = (encryptedText) => {
    try {
        const encryptedBuffer = Buffer.from(encryptedText, 'base64');
        const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, IV);
        let decrypted = decipher.update(encryptedBuffer);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString('utf-8');
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
};

module.exports = { decrypt };
