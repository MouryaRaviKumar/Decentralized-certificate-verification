// backend/controllers/certificateController.js (UPDATED with MongoDB Save)

import asyncHandler from 'express-async-handler';
import { uploadFileToIPFS } from '../services/ipfsService.js'; 
import Certificate from '../models/Certificate.js'; 

// @desc    Upload Certificate File to IPFS and save private metadata
// @route   POST /api/certificates/upload
// @access  Private (Issuer/Admin)
export const uploadCertificate = asyncHandler(async (req, res) => {
  // Capture new required fields from form-data body
  const { studentName, rollNumber } = req.body; 
  const fileBuffer = req.file.buffer;
  const fileName = req.file.originalname;

  // 1. Basic validation
  if (!fileBuffer || !rollNumber || !studentName) {
    res.status(400);
    throw new Error('Missing file, roll number, or student name.');
  }

  // 2. Check if a certificate already exists for this roll number
  const existingCert = await Certificate.findOne({ rollNumber });
  if (existingCert) {
      res.status(400);
      throw new Error('Certificate already exists for this roll number.');
  }

  // 3. Generate Public Identifier
  // We use rollNumber in the ID for unique generation, but the rollNumber itself is private (off-chain)
  const certificateId = `CERT-${rollNumber.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}`;

  // 4. UPLOAD FILE TO IPFS
  const certificateCID = await uploadFileToIPFS(fileBuffer, fileName);
  if (!certificateCID) {
    res.status(500);
    throw new Error('IPFS upload failed, no CID returned.');
  }

  // 5. SAVE PRIVATE METADATA TO MONGODB (The new private index)
  const privateRecord = await Certificate.create({
      rollNumber,
      certificateId,
      studentName,
      issuerId: req.user._id, // User ID from the authenticated JWT token
  });
  
  // 6. RESPOND with data needed for the Frontend Transaction
  res.status(201).json({
    message: 'File uploaded and private record created. Ready for blockchain transaction.',
    certificateId: privateRecord.certificateId,
    studentName: privateRecord.studentName,
    rollNumber: privateRecord.rollNumber,
    certificateCID: certificateCID,
    issuerEmail: req.user.email,
  });
});