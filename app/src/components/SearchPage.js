import React, { useState } from 'react';
import '../styles/SearchPage.css';
import axios from 'axios';

function SearchPage() {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const [downloads, setDownloads] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:5002/query?query=${encodeURIComponent(inputValue)}`);
      const filteredResults = res.data.results.filter(result => result.similarityIndex > 0);
      const sortedResults = filteredResults.sort((a, b) => b.similarityIndex - a.similarityIndex);
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

  const handleDownload = async (result) => {
    try {
      await axios.post('http://localhost:5002/download', {
        filename: result.filename,
        content: result.content
      });
      setDownloads(prevDownloads => [...prevDownloads, result]);
      alert(`File ${result.filename} downloaded successfully.`);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file.');
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
                <button onClick={() => handleDownload(result)}>Download</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;