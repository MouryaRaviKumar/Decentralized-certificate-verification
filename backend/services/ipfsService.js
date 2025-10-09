import axios from 'axios';
import { Readable } from 'stream'; 
import FormData from 'form-data';

const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlODhmMjFmNy0xMDYwLTRiNGUtODM5OC1iMDY3ZjExNDQ3YzUiLCJlbWFpbCI6Im1vdXJ5YTc1MzdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImZhNmQyNTM0ZThjMThmNjIxYWVlIiwic2NvcGVkS2V5U2VjcmV0IjoiMGEwMjFjODJhYzllNWEyYmMwYmU2MmU3ZTExMDAyNGEyMmUxZDYyYzlhZDgyYmU3N2IwYjBhYWRkMGUwZjllMSIsImV4cCI6MTc5MTM3NjgyNH0.dINE6k87O5jMhlqNhN6IIexAftw6c3K0jTfT1qOoF2o"; 

export const uploadFileToIPFS = async (fileBuffer, fileName) => {
    
    if (!PINATA_JWT) {
        throw new Error('Pinata JWT is missing.');
    }

    try {
        const formData = new FormData();

        const readableStream = Readable.from(fileBuffer);
        
        formData.append('file', readableStream, {
            filename: fileName,
            contentType: 'application/octet-stream' 
        });


        const metadata = JSON.stringify({ name: fileName });
        formData.append('pinataMetadata', metadata);
        
        console.log(`Attempting to upload ${fileName} to IPFS via Axios...`);

        const response = await axios.post(
            'https://api.pinata.cloud/pinning/pinFileToIPFS', 
            formData, 
            {
                maxBodyLength: 'Infinity',
                headers: {
                    'Authorization': `Bearer ${PINATA_JWT}`, 
                    ...formData.getHeaders(), 
                }
            }
        );

        if (response.data && response.data.IpfsHash) {
            console.log('Pinata Upload successful. CID:', response.data.IpfsHash);
            return response.data.IpfsHash; 
        } else {
            throw new Error(`Pinata did not return a hash. Response: ${JSON.stringify(response.data)}`);
        }

    } catch (error) {
        if (error.response) {
            console.error('Specific Pinata Error:', error.response.status, error.response.data);
            throw new Error(`IPFS upload failed with Pinata status ${error.response.status}`);
        } else {
            console.error('Axios/Network Error:', error.message);
            throw new Error('IPFS upload failed: Network or stream issue.'); 
        }
    }
};