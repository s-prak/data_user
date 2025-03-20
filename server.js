const express = require("express");
const cors = require("cors");
const TfIdf = require("tf-idf-search");
const axios = require("axios");
const { decrypt } = require("./decrypt");

const app = express();
const port = 5002;

app.use(cors());
app.use(express.json());

app.get("/query", async (req, res) => {
  const query = req.query.query; // ✅ Extract query correctly
  console.log(`🔍 Received query: ${query}`);

  if (!query) {
    console.log("❌ Missing query parameter");
    return res.status(400).json({ error: "Query parameter 'query' is required" });
  }

  try {
    // 1️⃣ Make a GET request to retrieve the index
    console.log("📡 Fetching inverted index from backend...");
    const response = await axios.get("http://localhost:8080/inverted-index/get-index");
    
    // 2️⃣ Extract the "index" from the response
    const encryptedIndex = response.data.index;
    console.log("🔐 Encrypted index received:", encryptedIndex ? "✅ Yes" : "❌ No");

    if (!encryptedIndex) {
      console.log("❌ No index found in response");
      return res.status(500).json({ error: "No index found in response" });
    }

    // 3️⃣ Decrypt the index
    console.log("🔓 Decrypting the index...");
    const decryptedIndex = decrypt(encryptedIndex);
    console.log("✅ Decryption successful");

    // 4️⃣ Parse the decrypted index
    const tfidfIndex = JSON.parse(decryptedIndex);
    console.log("📂 Parsed TF-IDF index:", tfidfIndex);

    // 5️⃣ Load the index into a TfIdf model
    console.log("📊 Initializing TF-IDF model...");
    const tfidfModel = Object.assign(new TfIdf(), tfidfIndex);
    console.log("✅ TF-IDF model initialized");

    // 6️⃣ Perform the search
    console.log(`🔍 Searching for: "${query}" in TF-IDF model...`);
    const searchResults = tfidfModel.rankDocumentsByQuery(query);
    console.log("🔎 Search results:", searchResults);

    // 7️⃣ Return the results
    res.json({ query, results: searchResults });
  } catch (error) {
    console.error("❌ Error processing query:", error);
    res.status(500).json({ error: "Failed to process query", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
