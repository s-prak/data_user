# Data User - Secure Search Client

## Project Overview

This project implements the client-side component of a secure multi-keyword ranked search system over encrypted cloud data. As a data user, this system allows you to securely search through encrypted documents stored in the cloud without compromising data privacy. The data owner (separate server) handles the encryption and storage of documents, while this client enables secure search operations and document retrieval.

## System Architecture

The data user system consists of two main components:

1. **Data User Server** (Port 5002)

   - Handles secure search operations
   - Communicates with the Search Server (port 8080) for encrypted index retrieval
   - Manages document downloads and local storage
   - Provides API endpoints for search and document management
   - Implements encryption/decryption for secure communication

2. **React Frontend**
   - Provides user interface for search operations
   - Displays search results and document previews
   - Manages document downloads
   - Handles user authentication and session management

## Technical Implementation

### Encryption/Decryption Module

The system uses AES-256-CBC encryption with:

- 32-byte secret key (shared with data owner)
- 16-byte initialization vector (IV)
- PKCS7 padding

Key files:

- `encrypt.js`: Handles encryption using CryptoJS
- `decrypt.js`: Handles decryption using Node.js crypto module

## API Documentation

### Data User Server (Port 5002)

#### Search API

```http
GET /query?query={search_terms}
```

- **Description**: Performs a secure search over encrypted documents
- **Parameters**:
  - `query`: String containing multiple search keywords
- **Internal Process**:
  1. Receives multi-keyword search query from user
  2. Encrypts the query using the same symmetric key as data owner (creates trapdoor)
  3. Sends encrypted trapdoor to Search Server (port 8080)
  4. Search Server performs TF-IDF ranking on encrypted documents
  5. Receives ranked encrypted documents from Search Server
  6. Decrypts documents using the shared symmetric key
  7. Returns ranked results to user
- **Response**:
  ```json
  {
    "query": "search terms",
    "results": [
      {
        "filename": "document_name",
        "content": "decrypted_content",
        "similarityIndex": 0.85
      }
    ]
  }
  ```

#### Download API

```http
POST /download
```

- **Description**: Downloads and saves a document locally
- **Request Body**:
  ```json
  {
    "filename": "document_name",
    "content": "document_content"
  }
  ```
- **Internal Process**:
  1. Receives encrypted document from Search Server (port 8080)
  2. Decrypts the document content using shared symmetric key
  3. Saves to local storage
- **Response**:
  ```json
  {
    "message": "File saved to /path/to/downloads/filename"
  }
  ```

#### List Downloads API

```http
GET /downloads
```

- **Description**: Lists all downloaded documents
- **Response**:
  ```json
  [
    {
      "filename": "document_name",
      "content": "document_content"
    }
  ]
  ```

### Dependencies

- Node.js
- Express.js
- CryptoJS
- Axios
- TF-IDF Search library

## Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start the Server**

   ```bash
   npm start
   ```

3. **Access the Application**
   - The server runs on `http://localhost:5002`
   - Ensure the Search server is running on port 8080

## Security Features

- End-to-end encryption of search queries using shared symmetric key
- Trapdoor generation for secure query transmission
- TF-IDF based document ranking on encrypted data
- Secure document retrieval and decryption
- Local document storage management
- Privacy-preserving search results

## Use Cases

- Secure document search in enterprise environments
- Privacy-preserving research document retrieval
- Secure access to encrypted business documents
- Confidential document management systems
