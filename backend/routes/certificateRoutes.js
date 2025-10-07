import express from 'express';
import multer from 'multer'; 
import { protect, checkRole } from '../middleware/authMiddleware.js';
import { uploadCertificate } from '../controllers/certificateController.js';
import { verifyCertificate, lookupCertificateId } from '../controllers/verificationController.js';

const router = express.Router();

const upload = multer({ 
    storage: multer.memoryStorage() 
});

router
    .route('/upload')
    .post(
        protect,
        checkRole('Issuer'),
        upload.single('certificateFile'), 
        uploadCertificate             
    );

router.route('/lookup/:rollNumber').get(lookupCertificateId); 
router.route('/verify/:certificateId').get(verifyCertificate);

export default router;