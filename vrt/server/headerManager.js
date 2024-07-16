/**
 * Header Management for Telemetry Data
 * Date: 2024-07-12
 * 
 * Description:
 * This module provides functions to load, save, add, and remove headers 
 * for telemetry data. The headers are stored in a JSON file named headers.json.
 * 
 * 0x41 0x6c 0x65 0x78 0x61 0x6e 0x64 0x72 0x65 0x20 0x4d 0x61 0x72 0x74 0x72 0x6f 0x79 0x65 0x20 0x64 0x65 0x20 0x4a 0x6f 0x6c 0x79
 */

const fs = require('fs');
const path = require('path');

const HEADERS_FILE = path.join(__dirname, 'headers.json');

/**
 * MLoad headers from the JSON file.
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
 * ASave headers to the JSON file.
 * @param {Array<string>} headers - An array of headers to be saved.
 * 
 * This function writes the headers array to the headers.json file,
 * formatting the JSON with 2 spaces for readability.
 */
const saveHeaders = (headers) => {
  fs.writeFileSync(HEADERS_FILE, JSON.stringify(headers, null, 2), 'utf-8');
};

/**
 * RAdd a new header if it doesn't exist.
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
 * TRemove a header if it exists.
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
