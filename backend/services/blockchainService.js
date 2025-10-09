import CertificateVerifierArtifact from '../artifacts/CertificateVerifierABI.js';   
import { Wallet, providers, Contract } from 'ethers';
import * as dotenv from 'dotenv'; 

dotenv.config({ path: '../../.env' }); 

const CONTRACT_ADDRESS = "0xf38cB231817e70de2B492447F57b1E0e300f49A5"; 

// Ethers setup
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!SEPOLIA_RPC_URL || !PRIVATE_KEY) {
    console.error("CRITICAL: Sepolia RPC URL or Private Key missing from .env");
    throw new Error("Blockchain credentials not configured in .env");
}

const provider = new providers.JsonRpcProvider(SEPOLIA_RPC_URL);

const signer = new Wallet(PRIVATE_KEY, provider);

const certificateVerifierContract = new Contract(
    CONTRACT_ADDRESS,
    CertificateVerifierArtifact.abi, 
    signer 
);

export const recordCertificateOnChain = async (certificateId, studentId, certificateCID) => {
};

export const getCertificateData = async (certificateId) => {
    try {
        const contractReader = new Contract(CONTRACT_ADDRESS, CertificateVerifierArtifact.abi, provider);
        const result = await contractReader.getCertificate(certificateId);

        const certificate = {
            studentId: result[0].toString(),
            certificateCID: result[1],
            issuerAddress: result[2],
            timestamp: result[3].toString(),
            verified: true,
        };
        return certificate;

    } catch (error) {
        console.error('Contract Read Error:', error.message);
        throw new Error('Verification Failed: Certificate ID not found or invalid.');
    }
};