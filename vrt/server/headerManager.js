const fs = require('fs');
const path = require('path');

const HEADERS_FILE = path.join(__dirname, 'headers.json');

/**
 * Load headers from the JSON file.
 * @returns {Array<string>} - An array of headers.
 * 
 * This function reads the headers from the headers.json file if it exists.
 * If the file does not exist, it returns an empty array.
 */
const loadHeaders = () => {
  if (fs.existsSync(HEADERS_FILE)) {
    const data = fs.readFileSync(HEADERS_FILE, 'utf-8');
    return JSON.parse(data);
  }
  return [];
};

/**
 * Save headers to the JSON file.
 * @param {Array<string>} headers - An array of headers to be saved.
 * 
 * This function writes the headers array to the headers.json file,
 * formatting the JSON with 2 spaces for readability.
 */
const saveHeaders = (headers) => {
  fs.writeFileSync(HEADERS_FILE, JSON.stringify(headers, null, 2), 'utf-8');
};

/**
 * Add a new header if it doesn't exist.
 * @param {string} header - The header to add.
 * 
 * This function loads the current headers, checks if the new header
 * is already present, and if not, adds the new header and saves the updated list.
 */
const addHeader = (header) => {
  const headers = loadHeaders();
  if (!headers.includes(header)) {
    headers.push(header);
    saveHeaders(headers);
    console.log(`Header added: ${header}`); // Logging the header added
  }
};

/**
 * Remove a header if it exists.
 * @param {string} header - The header to remove.
 * 
 * This function loads the current headers, checks if the header exists,
 * and if so, removes it and saves the updated list.
 */
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
