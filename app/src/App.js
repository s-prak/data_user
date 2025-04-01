import React, { useState } from 'react';
import './App.css';
import SearchPage from './components/SearchPage';
import ViewDownloadsPage from './components/ViewDownloadsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('search');

  const handleNavClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Data Owner</h1>
        <nav>
          <button onClick={() => handleNavClick('search')}>Query Page</button>
          <button onClick={() => handleNavClick('downloads')}>View Downloaded Files</button>
        </nav>
      </header>
      <main>
        {currentPage === 'search' && <SearchPage />}
        {currentPage === 'downloads' && <ViewDownloadsPage />}
      </main>
    </div>
  );
}

export default App;