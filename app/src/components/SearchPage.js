import React, { useState } from 'react';
import '../styles/SearchPage.css';
import axios from 'axios';

function SearchPage() {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:5002/query?query=${encodeURIComponent(inputValue)}`);
      // 🔹 Filter out results with similarityIndex = 0 before sorting
      const filteredResults = res.data.results.filter(result => result.similarityIndex > 0); 

      // 🔹 Sort the remaining results in descending order
      const sortedResults = filteredResults.sort((a, b) => b.similarityIndex - a.similarityIndex);


      // Fetch document content for each result
      const updatedResults = await Promise.all(sortedResults.map(async (result) => {
        try {
          
          return {
            filename: result.filename,
            content: result.content,
            similarityIndex: result.similarityIndex
          };
        } catch (error) {
          console.error(`Error fetching document for ${result.filename}:`, error);
          return {
            filename: result.filename,
            content: 'Error fetching document',
            similarityIndex: result.similarityIndex
          };
        }
      }));

      setResults(updatedResults);
    } catch (error) {
      console.error('Error fetching data:', error);
      setResults([{ error: 'Error fetching data' }]);
    }
  };

  return (
    <div className="SearchPage">
      <h1>Search</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Input:
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      <div className="results">
        {results.map((result, index) => (
          <div key={index} className="result-card">
            {result.error ? (
              <p className="error-text">{result.error}</p>
            ) : (
              <>
                <h3 className="filename">{result.filename}</h3>
                <p className="content">{result.content}</p>
                <div className="similarity-bar">
                  <div
                    className="similarity-bar-fill"
                    style={{ width: `${result.similarityIndex * 100}%` }}
                  ></div>
                </div>
                <p className="similarity-text">Similarity: {Math.round(result.similarityIndex * 100)}%</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;
