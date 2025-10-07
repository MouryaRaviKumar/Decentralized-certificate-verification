// backend/services/ipfsService.js

import { Web3Storage, File } from 'web3.storage';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

// Initialize the client using the token from the root .env
const storage = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN });

/**
 * Converts a file buffer to an array of Web3.Storage File objects.
 * @param {Buffer} buffer The file buffer
 * @param {string} fileName The desired file name
 * @returns {Array<File>} Array of File objects for Web3Storage
 */
function getFilesFromBuffer(buffer, fileName) {
  const file = new File([buffer], fileName);
  return [file];
}

/**
 * Uploads a file buffer to IPFS via web3.storage.
 * @param {Buffer} fileBuffer The file content as a Buffer
 * @param {string} fileName The name to give the file (e.g., certificate.pdf)
 * @returns {Promise<string>} The Content Identifier (CID) of the uploaded file
 */
export const uploadFileToIPFS = async (fileBuffer, fileName) => {
  try {
    const files = getFilesFromBuffer(fileBuffer, fileName);
    console.log(`Uploading ${fileName} to IPFS...`);
    
    // The client.put method returns the CID of the uploaded content
    const cid = await storage.put(files); 
    console.log('IPFS Upload successful. CID:', cid);

    return cid;
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw new Error('IPFS upload failed.');
  }
};