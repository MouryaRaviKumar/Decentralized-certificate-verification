// frontend/src/BlockchainContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers'; // Ethers V6 Syntax
import { getContractArtifacts } from './services/api'; 

// Define the Context
const BlockchainContext = createContext();

// Custom hook to use the context
export const useBlockchain = () => useContext(BlockchainContext);

export const BlockchainProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractAddress, setContractAddress] = useState(null); 
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  /**
   * Initializes the Contract instance using the Signer.
   */
  const initializeEthers = async (address, abi, currentProvider, signer) => {
      try {
          const certificateContract = new ethers.Contract(
              address,
              abi,
              signer // Use the awaited signer
          );
          setContract(certificateContract);
          setContractAddress(address);
          setIsWalletConnected(true);
          console.log("Contract Initialized and Wallet Connected. Ready for transactions.");

      } catch (error) {
          console.error("Ethers initialization error:", error);
          alert("Could not initialize contract. Ensure MetaMask is on the Sepolia network.");
          setIsWalletConnected(false);
      }
  };

  /**
   * Connects to MetaMask and dynamically fetches contract artifacts from backend.
   */
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install it to proceed.");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      setCurrentAccount(account);
      
      // 2. Initialize Ethers Provider (CRITICAL FIX: Ethers V6 syntax)
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);

      // 3. Get Signer (CRITICAL FIX: Must await the getSigner call in Ethers V6)
      const signer = await newProvider.getSigner();

      // 4. Dynamically fetch ABI and Address from our backend API
      const response = await getContractArtifacts();
      const { address: deployedAddress, abi } = response.data;

      // 5. Initialize contract
      await initializeEthers(deployedAddress, abi, newProvider, signer); // Pass Signer
      
    } catch (error) {
      console.error("Wallet connection failed:", error);
      alert("Error connecting wallet. Check your console and network.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Effect hook to detect initial connection and account changes.
   */
  useEffect(() => {
    if (window.ethereum) {
        // Automatically connect if user is already logged into MetaMask
        window.ethereum.request({ method: 'eth_accounts' })
            .then(accounts => {
                if (accounts.length > 0) {
                    connectWallet();
                }
            });

        // Set up listener for account changes (MetaMask event)
        const handleAccountsChanged = (accounts) => {
            if (accounts.length > 0) {
                // If account changes, re-initialize everything
                connectWallet();
            } else {
                // If disconnected
                setCurrentAccount(null);
                setContract(null);
                setProvider(null);
                setIsWalletConnected(false);
                console.log("Wallet disconnected.");
            }
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);

        // Cleanup function
        return () => {
            if (window.ethereum && window.ethereum.removeListener) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        }
    }
  }, []);

  return (
    <BlockchainContext.Provider
      value={{
        currentAccount,
        connectWallet,
        contract,
        provider,
        contractAddress,
        isLoading,
        isWalletConnected,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};