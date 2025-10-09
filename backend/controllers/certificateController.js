import asyncHandler from 'express-async-handler';
import { uploadFileToIPFS } from '../services/ipfsService.js'; 
import Certificate from '../models/Certificate.js'; 

export const uploadCertificate = asyncHandler(async (req, res) => {
  const { studentName, rollNumber } = req.body; 
  const fileBuffer = req.file.buffer;
  const fileName = req.file.originalname;

  if (!fileBuffer || !rollNumber || !studentName) {
    res.status(400);
    throw new Error('Missing file, roll number, or student name.');
  }

  const existingCert = await Certificate.findOne({ rollNumber });
  if (existingCert) {
      res.status(400);
      throw new Error('Certificate already exists for this roll number.');
  }

  const certificateId = `CERT-${rollNumber.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}`;

  const certificateCID = await uploadFileToIPFS(fileBuffer, fileName);
  if (!certificateCID) {
    res.status(500);
    throw new Error('IPFS upload failed, no CID returned.');
  }

  const privateRecord = await Certificate.create({
      rollNumber,
      certificateId,
      studentName,
      issuerId: req.user._id,
  });
  
  res.status(201).json({
    message: 'File uploaded and private record created. Ready for blockchain transaction.',
    certificateId: privateRecord.certificateId,
    studentName: privateRecord.studentName,
    rollNumber: privateRecord.rollNumber,
    certificateCID: certificateCID,
    issuerEmail: req.user.email,
  });
});