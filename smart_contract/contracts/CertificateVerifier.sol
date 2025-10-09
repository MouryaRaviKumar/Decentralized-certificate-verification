
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract CertificateVerifier is AccessControl {

    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE"); 


    struct Certificate {
        uint256 studentId;
        string certificateCID; // The IPFS Content Identifier (Hash)
        address issuer;
        uint256 timestamp;
    }

    mapping(string => Certificate) private certificates;
    
    mapping(string => bool) public certificateExists;

    event CertificateIssued(
        string indexed certificateId, 
        uint256 indexed studentId,   
        address indexed issuer,      
        string certificateCID,
        uint256 timestamp
    );
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);
    }

    function issueCertificate(
        string memory certificateId,
        uint256 studentId,
        string memory certificateCID
    ) public onlyRole(ISSUER_ROLE) {
        require(!certificateExists[certificateId], "Certificate already issued.");

        certificates[certificateId] = Certificate({
            studentId: studentId,
            certificateCID: certificateCID,
            issuer: msg.sender,
            timestamp: block.timestamp
        });

        certificateExists[certificateId] = true;

        emit CertificateIssued(
            certificateId,
            studentId,
            msg.sender,
            certificateCID,
            block.timestamp
        );
    }

    function getCertificate(
        string memory certificateId
    ) public view returns (
        uint256,
        string memory,
        address,
        uint256
    ) {
        require(certificateExists[certificateId], "Certificate not found.");
        Certificate memory cert = certificates[certificateId];
        
        return (
            cert.studentId,
            cert.certificateCID,
            cert.issuer,
            cert.timestamp
        );
    }
}