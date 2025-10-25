// frontend/src/services/ipfs.js

import axios from 'axios';

/**
 * Fetches the raw file content from the IPFS gateway.
 * @param {string} cid The Content Identifier (hash)
 * @returns {Promise<Blob>} The file content as a Blob
 */
export const fetchFileFromIPFS = async (cid) => {
    // Pinata public gateway URL
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${cid}`; 
    
    try {
        const response = await axios.get(gatewayUrl, {
            responseType: 'blob', // Important: get the raw file content
        });

        // Log to console for debugging
        console.log(`Successfully fetched file from IPFS: ${gatewayUrl}`);

        return response.data; // This is a Blob object (the file)

    } catch (error) {
        console.error('Failed to retrieve file from IPFS:', error);
        throw new Error('File retrieval failed. CID might be incorrect or unpinned.');
    }
};