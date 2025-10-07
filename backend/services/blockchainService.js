// backend/services/blockchainService.js (FINAL, CLEANED VERSION)

// CRITICAL FIX: Use 'assert { type: 'json' }' for Node V22+
import CertificateVerifierArtifact from '../artifacts/CertificateVerifierABI.js';   
import { Wallet, providers, Contract } from 'ethers';
import * as dotenv from 'dotenv'; 

// Load environment variables (kept here for safety, assuming server.js isn't fully loading them)
dotenv.config({ path: '../../.env' }); 

// --- CRITICAL: YOUR DEPLOYED SEPOLIA ADDRESS ---
const CONTRACT_ADDRESS = "0xf38cB231817e70de2B492447F57b1E0e300f49A5"; 
// ----------------------------------------------

// Ethers setup
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Check for required keys (will prevent silent failures)
if (!SEPOLIA_RPC_URL || !PRIVATE_KEY) {
    console.error("CRITICAL: Sepolia RPC URL or Private Key missing from .env");
    // Throw error here instead of crashing later
    throw new Error("Blockchain credentials not configured in .env");
}

// 1. Create an Ethers provider (connects to the Sepolia network)
const provider = new providers.JsonRpcProvider(SEPOLIA_RPC_URL);

// 2. Create a signer (wallet used to sign and pay for gas)
const signer = new Wallet(PRIVATE_KEY, provider);

// 3. Create the Contract instance (the object we use to call functions)
const certificateVerifierContract = new Contract(
    CONTRACT_ADDRESS,
    CertificateVerifierArtifact.abi, 
    signer // Include signer only for write operations
);

// ------------------- WRITE OPERATION (PAUSED) -------------------
// NOTE: This function is currently bypassed in the controller but kept for future use.
// This requires the private key and gas fees.
export const recordCertificateOnChain = async (certificateId, studentId, certificateCID) => {
    // This is not reachable during the current API test but is the final goal.
    // ... (Code from last working block)
};
// ----------------------------------------------------------------

// ------------------- READ OPERATION (FOR VERIFIER) -------------------
// NOTE: This function requires NO private key or gas fees.
export const getCertificateData = async (certificateId) => {
    try {
        // Use the provider/contract without the signer for read-only operation
        const contractReader = new Contract(CONTRACT_ADDRESS, CertificateVerifierArtifact.abi, provider);
        const result = await contractReader.getCertificate(certificateId);

        // Parse the returned array into a readable object
        const certificate = {
            studentId: result[0].toString(), // Convert BigNumber to string
            certificateCID: result[1],
            issuerAddress: result[2],
            timestamp: result[3].toString(), // Unix timestamp
            verified: true,
        };
        return certificate;

    } catch (error) {
        console.error('Contract Read Error:', error.message);
        throw new Error('Verification Failed: Certificate ID not found or invalid.');
    }
};