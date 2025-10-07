// backend/test_pinata.js
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); 

const PINATA_JWT = process.env.PINATA_JWT;

const testPinata = async () => {
    try {
        const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${PINATA_JWT}`
            }
        });
        const text = await response.text();

        if (response.ok) {
            console.log("PINATA AUTHENTICATION SUCCESSFUL! Message:", text);
        } else {
            console.error("PINATA AUTHENTICATION FAILED. Status:", response.status, "Message:", text);
        }
    } catch (error) {
        console.error("Network Error during Pinata test:", error.message);
    }
};

testPinata();