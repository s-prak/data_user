 ## Core Implementations

### 1. Encryption and Decryption

#### Encryption
- **Algorithm**: AES-256 in CBC mode.
- **Implementation**:
  - The encryption module (`encrypt.js`) encrypts documents and indices before uploading them to the cloud server.
  - Each document and its associated TF-IDF index are encrypted using a securely managed key.

```javascript name=encrypt.js
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

module.exports = { encrypt };
```

#### Decryption
- **Algorithm**: AES-256 in CBC mode.
- **Implementation**:
  - The decryption module complements the encryption process, enabling secure retrieval and usage of documents and indices.

```javascript name=decrypt.js
const CryptoJS = require("crypto-js");

const SECRET_KEY = CryptoJS.enc.Utf8.parse("1234567890abcdef1234567890abcdef"); // Same key as used in encryption
const IV = CryptoJS.enc.Utf8.parse("0000000000000000"); // Same IV as used in encryption

const decrypt = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { decrypt };
```

---

### 2. TF-IDF Model

#### Description
- The **TF-IDF (Term Frequency-Inverse Document Frequency)** model enables ranked keyword-based search. It calculates the relevance of keywords in each document and stores this as an encrypted index.

#### Implementation
- The `tfidf-server.js` processes documents to compute the TF-IDF indices.
- These indices are encrypted and uploaded to the cloud server.

```javascript
const TfIdf = require("tf-idf-search");
const tf_idf = new TfIdf();

// Add document to the TF-IDF model
tf_idf.addDocumentFromString(document);

// Upload encrypted index to server
const postIndexResponse = await axios.post(
  "http://cloud-server-url/inverted-index/post-index",
  { index: encrypt(JSON.stringify(tf_idf)) }
);
```

---

### 3. React Applications

#### General Guide for Installing and Running a React App

1. **Install Node.js**:
   - Download and install Node.js from the [official website](https://nodejs.org/).

2. **Set Up a React App**:
   - Use the following command to create a new React app:
     ```bash
     npx create-react-app my-app
     ```
   - Replace `my-app` with your desired project name.

3. **Navigate to the App Directory**:
   ```bash
   cd my-app
   ```

4. **Install Dependencies**:
   - If you clone a React app from a repository, ensure you install the required dependencies:
     ```bash
     npm install
     ```

5. **Start the Development Server**:
   - To start the app, use:
     ```bash
     npm start
     ```
   - Open [http://localhost:3000](http://localhost:3000) in your browser.
