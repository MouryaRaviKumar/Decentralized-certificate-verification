// backend/routes/contractRoutes.js

import express from 'express';
import CertificateVerifierArtifact from '../artifacts/CertificateVerifierABI.js'; // Assuming you fixed the extension

const router = express.Router();

// CRITICAL: PASTE YOUR DEPLOYED SEPOLIA ADDRESS HERE
const CONTRACT_ADDRESS = "0xf38cB231817e70de2B492447F57b1E0e300f49A5"; 

// @desc    Get contract address and ABI
// @route   GET /api/contract
// @access  Public
router.get('/', (req, res) => {
    res.json({
        address: CONTRACT_ADDRESS,
        abi: CertificateVerifierArtifact.abi,
    });
});

export default router;