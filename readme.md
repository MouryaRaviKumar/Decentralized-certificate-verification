# 🛡️ College Blockchain Certificate Verification System

Decentralized MERN stack application (DApp) designed to provide immutable verification for academic certificates using the Ethereum Sepolia Testnet and IPFS. This project emphasizes secure, decentralized storage and verifiable data integrity.

**Collaborator:** [RishithaBai263](https://github.com/RishithaBai263)

A special thank you to **RishithaBai** for their crucial contributions to this project. Their dedication to resolving complex environment and dependency conflicts (particularly the Ethers V3/V5 and Pinata SDK issues) was instrumental in stabilizing the backend and ensuring the final deployment of the smart contract. Their tenacious troubleshooting guaranteed the success of the project's foundation.

## ✨ Project Features 

This system acts as a **digital notary**, making academic certificates impossible to forge and instantly verifiable by employers worldwide.

| User Role | Actions | Benefit |
| :--- | :--- | :--- |
| **College (Issuer/Admin)** | Logs in, uploads the certificate PDF, and submits the digital fingerprint (CID) to the blockchain. | **Zero Forgery Risk.** Creates a permanent, immutable record that guarantees the certificate's authenticity. |
| **Student (Holder)** | Provides their unique Certificate ID to any third party. | **Lifetime Proof.** Owns a credential that is instantly verifiable without needing to request transcripts. |
| **Employer (Verifier)** | Enters a Roll Number into the public verification portal. | **Instant Trust.** The system retrieves the public record from the blockchain and proves the file's hash matches the original immutable record. |

---

## 🏗️ Architecture and Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Blockchain** | **Solidity ^0.8.x, Hardhat V2, Ethers.js (V5)** | Smart contract deployed on the **Sepolia Testnet** for immutable data storage and Role-Based Access Control (RBAC). |
| **Backend/API** | **Node.js, Express.js, JWT, MongoDB Atlas** | Handles **JWT Authentication**, secures the **Roll Number $\rightarrow$ Certificate ID** private lookup index, and provides all API routes. |
| **Storage** | **IPFS (via Pinata Free Tier)** | Stores the actual certificate files. The blockchain stores only the file's immutable **Content Identifier (CID)**. |
| **Frontend** | **React.js, Ethers.js, Axios** | Dashboards for Issuer (Upload), Student (View), and Verifier (Lookup). MetaMask is used for client-side signing. |

---

## 🛠️ Setup and Installation Guide

### Prerequisites

1.  **Node.js:** (v18+ recommended)
2.  **MongoDB Atlas:** A free-tier cluster URL (`MONGO_URI`).
3.  **MetaMask:** A dedicated test wallet funded with free Sepolia ETH.
4.  **Pinata:** A free account and a generated **JWT** (`PINATA_JWT`).
5.  **Alchemy/Infura:** A free account and a **Sepolia RPC URL** (`SEPOLIA_RPC_URL`).

### 1. Project Setup and Environment Configuration

1.  **Clone Repository:**
    ```bash
    git clone https://github.com/MouryaRaviKumar/Decentralized-certificate-verification
    cd <YOUR_PROJECT_NAME>
    ```

2.  **Create `.gitignore`:** Ensure the following are in your root `.gitignore`: `.env`, `node_modules`, `/smart_contract/cache`, `/smart_contract/artifacts`.

3.  **Configure `.env`:** Create a file named **`.env`** in the **project root** and populate it:

    ```dotenv
    # ./.env

    # --- BLOCKCHAIN/DEPLOYMENT ---
    PRIVATE_KEY="<YOUR_TESTNET_WALLET_PRIVATE_KEY>"
    SEPOLIA_RPC_URL="<YOUR_SEPOLIA_RPC_URL>"

    # --- BACKEND/AUTH/DATABASE ---
    MONGO_URI="<YOUR_MONGODB_ATLAS_CONNECTION_STRING>"
    JWT_SECRET="<A_LONG_RANDOM_STRING_FOR_JWT>"
    ```

    *Note: The `PINATA_JWT` is currently hardcoded in `backend/services/ipfsService.js` for development stability.*

### 2. Smart Contract Status (Completed)

The contract is **ALREADY DEPLOYED** on Sepolia at the following address:
**`0xf38cB231817e70de2B492447F57b1E0e300f49A5`**

If you need to re-deploy (or verify artifacts):
```bash
cd smart_contract
npm install # Install V2 dependencies
npx hardhat compile
# Deploy using: npx hardhat run scripts/deploy.js --network sepolia