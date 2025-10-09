import asyncHandler from 'express-async-handler';
import { getCertificateData } from '../services/blockchainService.js';
import Certificate from '../models/Certificate.js';

export const verifyCertificate = asyncHandler(async (req, res) => {
    const { certificateId } = req.params;

    if (!certificateId) {
        res.status(400);
        throw new Error('Certificate ID is required for verification.');
    }

    const certificateData = await getCertificateData(certificateId);

    const privateRecord = await Certificate.findOne({ certificateId });

    const ipfsGatewayUrl = `https://gateway.pinata.cloud/ipfs/${certificateData.certificateCID}`;
    
    res.json({
        message: 'Certificate record found on blockchain.',
        studentName: privateRecord ? privateRecord.studentName : 'Private Data Unavailable',
        rollNumber: privateRecord ? privateRecord.rollNumber : 'N/A',
        ...certificateData,
        ipfsGatewayUrl: ipfsGatewayUrl, 
    });
});

export const lookupCertificateId = asyncHandler(async (req, res) => {
    const { rollNumber } = req.params;

    if (!rollNumber) {
        res.status(400);
        throw new Error('Roll Number is required for lookup.');
    }

    const record = await Certificate.findOne({ rollNumber });

    if (!record) {
        res.status(404);
        throw new Error('Certificate record not found for this Roll Number.');
    }

    res.json({
        certificateId: record.certificateId,
        studentName: record.studentName,
        rollNumber: record.rollNumber,
    });
});