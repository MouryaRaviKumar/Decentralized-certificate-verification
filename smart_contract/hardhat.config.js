// smart_contract/hardhat.config.js (COMMONJS / Hardhat V2)

require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: "../.env" }); // Uses require()

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // Hardhat V2 uses implicit config
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    // CRITICAL: Saves contract ABI and bytecode to the frontend folder
    artifacts: "../frontend/src/artifacts", 
  },
};