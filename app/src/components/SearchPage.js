import React, { useState } from 'react';
import '../styles/SearchPage.css';
import axios from 'axios';

function SearchPage() {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:5002/query?query=${inputValue}`);
      const sortedResults = res.data.results.sort((a, b) => b.similarityIndex - a.similarityIndex);
      setResults(sortedResults);
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
              <p>{result.error}</p>
            ) : (
              <>
                <p>{result.document.join(' ')}</p>
                <div className="similarity-bar">
                  <div className="similarity-bar-fill" style={{ width: `${result.similarityIndex * 100}%` }}></div>
                </div>
                <p className="similarity-text">Similarity: {result.similarityIndex * 100}%</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;