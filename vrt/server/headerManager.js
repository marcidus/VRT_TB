const fs = require('fs');
const path = require('path');

const HEADERS_FILE = path.join(__dirname, 'headers.json');

// Load headers from the JSON file
const loadHeaders = () => {
  if (fs.existsSync(HEADERS_FILE)) {
    const data = fs.readFileSync(HEADERS_FILE, 'utf-8');
    return JSON.parse(data);
  }
  return [];
};

// Save headers to the JSON file
const saveHeaders = (headers) => {
  fs.writeFileSync(HEADERS_FILE, JSON.stringify(headers, null, 2), 'utf-8');
};

// Add a new header if it doesn't exist
const addHeader = (header) => {
  const headers = loadHeaders();
  if (!headers.includes(header)) {
    headers.push(header);
    saveHeaders(headers);
    console.log(`Header added: ${header}`); // Logging the header added
  }
};

// Remove a header if it exists
const removeHeader = (header) => {
  let headers = loadHeaders();
  if (headers.includes(header)) {
    headers = headers.filter(h => h !== header);
    saveHeaders(headers);
    console.log(`Header removed: ${header}`); // Logging the header removed
  }
};

module.exports = {
  loadHeaders,
  addHeader,
  removeHeader
};
