// frontend/src/components/VerifierDashboard.jsx

import React, { useState } from 'react';
import { lookupCertificate, verifyOnChain } from '../services/api'; 
import { fetchFileFromIPFS } from '../services/ipfs'; 

const VerifierDashboard = () => {
    const [rollNumber, setRollNumber] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);
    const [status, setStatus] = useState('Enter Roll Number to verify.');
    const [isVerifying, setIsVerifying] = useState(false);

    const handleVerification = async (e) => {
        e.preventDefault();
        setVerificationResult(null);
        setStatus('1/3: Searching private index...');
        setIsVerifying(true);

        try {
            // 1. Backend Lookup (Private MongoDB Index)
            const lookupResponse = await lookupCertificate(rollNumber);
            const { certificateId, studentName } = lookupResponse.data;
            
            setStatus(`2/3: Record found for ${studentName}. Reading public blockchain...`);

            // 2. Blockchain Verification (Public Contract Read)
            const verifyResponse = await verifyOnChain(certificateId);
            const verifiedData = verifyResponse.data;

            setStatus('3/3: Blockchain record confirmed. Fetching file from IPFS...');

            // 3. IPFS File Retrieval (For display/download)
            const fileBlob = await fetchFileFromIPFS(verifiedData.certificateCID);
            const fileUrl = URL.createObjectURL(fileBlob);

            setVerificationResult({
                ...verifiedData,
                studentName: studentName, // Merge private name for display
                rollNumber: rollNumber,
                fileUrl: fileUrl,
            });

            setStatus('✅ Verification Successful! The certificate is immutable and authentic.');

        } catch (err) {
            console.error("Verification failed:", err);
            const errorMsg = err.response ? err.response.data.message : err.message;
            setStatus(`❌ Verification Failed: ${errorMsg}`);
        } finally {
            setIsVerifying(false);
        }
    };

    const statusColor = status.startsWith('❌') ? 'red' : status.startsWith('✅') ? 'green' : '#333';

    return (
        <div style={{ padding: '20px', textAlign: 'left', maxWidth: '600px', margin: 'auto' }}>
            <h3 style={{color: '#007bff', paddingBottom: '10px', borderBottom: '1px solid #ccc'}}>Certificate Verification Portal (Public)</h3>
            <p style={{ color: '#555', fontSize: '14px' }}>Verify authenticity by searching the college's private index first.</p>
            
            <form onSubmit={handleVerification} style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
                <input 
                    type="text" 
                    placeholder="Enter College Roll Number"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    required
                    disabled={isVerifying}
                    style={{ padding: '10px', flexGrow: 1 }}
                />
                <button type="submit" disabled={isVerifying} style={{ padding: '10px 20px' }}>
                    {isVerifying ? 'Verifying...' : 'Verify Certificate'}
                </button>
            </form>

            {/* Status Feedback */}
            <div style={{ padding: '10px', backgroundColor: '#e0f7ff', border: '1px solid #b3e5ff', borderRadius: '5px' }}>
                <strong style={{ color: statusColor }}>Status:</strong> {status}
            </div>

            {/* --- Verification Results --- */}
            {verificationResult && (
                <div style={{ borderTop: '1px solid #eee', marginTop: '20px', paddingTop: '15px', textAlign: 'left', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                    <h4 style={{ color: '#28a745' }}>✅ Certificate Authenticated</h4>
                    <p><strong>Student:</strong> {verificationResult.studentName}</p>
                    <p><strong>Roll No:</strong> {verificationResult.rollNumber}</p>
                    <p><strong>Issued By:</strong> {verificationResult.issuerAddress.substring(0, 10)}...</p>
                    <p><strong>CID (Hash):</strong> <code style={{ wordBreak: 'break-all' }}>{verificationResult.certificateCID}</code></p>
                    
                    <a 
                        href={verificationResult.fileUrl} 
                        download={`Certificate-${verificationResult.rollNumber}.pdf`}
                        style={{ display: 'block', marginTop: '15px', color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}
                    >
                        ⬇️ Download Verified File
                    </a>
                </div>
            )}
        </div>
    );
};

export default VerifierDashboard;