// smart_contract/contracts/CertificateVerifier.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import the AccessControl contract from OpenZeppelin
import "@openzeppelin/contracts/access/AccessControl.sol";

contract CertificateVerifier is AccessControl {
    // ================== ROLES ==================
    // Define custom roles as unique bytes32 values
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE"); 

    // ================== DATA STRUCTURE ==================
    // Structure to hold all data for a single certificate
    struct Certificate {
        uint256 studentId;
        string certificateCID; // The IPFS Content Identifier (Hash)
        address issuer;
        uint256 timestamp;
    }

    // Main storage: maps the unique Certificate ID (string) to the Certificate data (struct)
    mapping(string => Certificate) private certificates;
    
    // Auxiliary mapping: used to check if a Certificate ID exists (faster than checking the struct)
    mapping(string => bool) public certificateExists;

    // ================== EVENTS ==================
    // Event emitted after a successful certificate issuance for off-chain listeners (frontend/backend)
    event CertificateIssued(
        string indexed certificateId, // indexed for search speed
        uint256 indexed studentId,   // indexed for search speed
        address indexed issuer,      // indexed for search speed
        string certificateCID,
        uint256 timestamp
    );
    
    // ================== CONSTRUCTOR ==================
    constructor() {
        // Grant the deployer (msg.sender) the highest administration role
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        // Grant the deployer the ability to issue certificates for testing
        _grantRole(ISSUER_ROLE, msg.sender);
    }

    // ================== WRITE FUNCTION (ISSUER-ONLY) ==================
    // Only wallets with the ISSUER_ROLE can call this function
    function issueCertificate(
        string memory certificateId,
        uint256 studentId,
        string memory certificateCID
    ) public onlyRole(ISSUER_ROLE) {
        // Validation: Ensure the certificate ID has not been used before
        require(!certificateExists[certificateId], "Certificate already issued.");

        // Store the new certificate data
        certificates[certificateId] = Certificate({
            studentId: studentId,
            certificateCID: certificateCID,
            issuer: msg.sender,
            timestamp: block.timestamp
        });

        // Mark the certificate ID as existing
        certificateExists[certificateId] = true;

        // Emit the event
        emit CertificateIssued(
            certificateId,
            studentId,
            msg.sender,
            certificateCID,
            block.timestamp
        );
    }

    // ================== READ FUNCTION (PUBLIC/VERIFIER) ==================
    // Public view function to retrieve certificate details (no gas cost)
    function getCertificate(
        string memory certificateId
    ) public view returns (
        uint256,
        string memory,
        address,
        uint256
    ) {
        // Validation: Ensure the certificate exists
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