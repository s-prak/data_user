import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ViewDownloadsPage.css';

function ViewDownloadsPage() {
  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const response = await axios.get('http://localhost:5002/downloads');
        setDownloads(response.data);
      } catch (error) {
        console.error('Error fetching downloaded files:', error);
      }
    };

    fetchDownloads();
  }, []);

  return (
    <div className="ViewDownloadsPage">
      <h1>Downloaded Files</h1>
      <div className="downloads">
        {downloads.map((download, index) => (
          <div key={index} className="download-card">
            <h3 className="filename">{download.filename}</h3>
            <pre>{download.content}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewDownloadsPage;