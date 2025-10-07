// backend/controllers/verificationController.js

import asyncHandler from 'express-async-handler';
import { getCertificateData } from '../services/blockchainService.js';
import Certificate from '../models/Certificate.js'; // IMPORT the new model

// @desc    Verify a certificate by ID (Public blockchain read)
// @route   GET /api/certificates/verify/:certificateId
// @access  Public
export const verifyCertificate = asyncHandler(async (req, res) => {
    const { certificateId } = req.params;

    if (!certificateId) {
        res.status(400);
        throw new Error('Certificate ID is required for verification.');
    }

    // 1. Fetch immutable record from the blockchain
    const certificateData = await getCertificateData(certificateId);

    // 2. Look up student name privately (optional, but enhances display)
    const privateRecord = await Certificate.findOne({ certificateId });

    // 3. The CID is the permanent link to the file on IPFS
    const ipfsGatewayUrl = `https://gateway.pinata.cloud/ipfs/${certificateData.certificateCID}`;
    
    // 4. Respond with the combined data
    res.json({
        message: 'Certificate record found on blockchain.',
        // Private Data
        studentName: privateRecord ? privateRecord.studentName : 'Private Data Unavailable',
        rollNumber: privateRecord ? privateRecord.rollNumber : 'N/A',
        // Public Blockchain Data
        ...certificateData,
        ipfsGatewayUrl: ipfsGatewayUrl, 
    });
});


// @desc    Private API to get public Certificate ID using Roll Number
// @route   GET /api/certificates/lookup/:rollNumber
// @access  Public (Used by Verifier frontend to initiate blockchain search)
export const lookupCertificateId = asyncHandler(async (req, res) => {
    const { rollNumber } = req.params;

    if (!rollNumber) {
        res.status(400);
        throw new Error('Roll Number is required for lookup.');
    }

    // Look up the private record in MongoDB
    const record = await Certificate.findOne({ rollNumber });

    if (!record) {
        res.status(404);
        throw new Error('Certificate record not found for this Roll Number.');
    }

    // Return the public ID needed to query the blockchain
    res.json({
        certificateId: record.certificateId,
        studentName: record.studentName,
        rollNumber: record.rollNumber,
    });
});