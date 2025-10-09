
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners(); 

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  const CertificateVerifier = await ethers.getContractFactory("CertificateVerifier");
  const certificateVerifier = await CertificateVerifier.deploy();

  await certificateVerifier.deployed();

  console.log("CertificateVerifier deployed to:", certificateVerifier.address);

  const issuerRole = await certificateVerifier.ISSUER_ROLE();
  const isAdmin = await certificateVerifier.hasRole(certificateVerifier.DEFAULT_ADMIN_ROLE(), deployer.address);
  const isIssuer = await certificateVerifier.hasRole(issuerRole, deployer.address);

  console.log(`Deployer is Admin: ${isAdmin}`);
  console.log(`Deployer is Issuer: ${isIssuer}`);

  try {

      await certificateVerifier.issueCertificate("CERT-TEST-999", 999, "QmTxxxTestCIDxxx"); 
      console.log("SUCCESS: issueCertificate call by deployer (Issuer) succeeded.");
  } catch (error) {
      console.error("ERROR: issueCertificate call by deployer failed unexpectedly. Message:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });