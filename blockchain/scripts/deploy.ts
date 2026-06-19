import { ethers, network } from "hardhat";
import * as fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("═".repeat(60));
  console.log("FractionalEstate Deployment");
  console.log("═".repeat(60));
  console.log(`Network: ${network.name}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Balance: ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH`);
  console.log("─".repeat(60));

  // Deploy InvestorRegistry
  console.log("\n1. Deploying InvestorRegistry...");
  const InvestorRegistry = await ethers.getContractFactory("InvestorRegistry");
  const investorRegistry = await InvestorRegistry.deploy();
  await investorRegistry.waitForDeployment();
  const investorRegistryAddress = await investorRegistry.getAddress();
  console.log(`   ✓ InvestorRegistry: ${investorRegistryAddress}`);

  // Deploy FractionalEstate
  console.log("\n2. Deploying FractionalEstate...");
  const treasury = deployer.address;
  const FractionalEstate = await ethers.getContractFactory("FractionalEstate");
  const fractionalEstate = await FractionalEstate.deploy(treasury, investorRegistryAddress);
  await fractionalEstate.waitForDeployment();
  const fractionalEstateAddress = await fractionalEstate.getAddress();
  console.log(`   ✓ FractionalEstate: ${fractionalEstateAddress}`);

  // Deploy PropertyGovernance
  console.log("\n3. Deploying PropertyGovernance...");
  const PropertyGovernance = await ethers.getContractFactory("PropertyGovernance");
  const propertyGovernance = await PropertyGovernance.deploy(fractionalEstateAddress);
  await propertyGovernance.waitForDeployment();
  const propertyGovernanceAddress = await propertyGovernance.getAddress();
  console.log(`   ✓ PropertyGovernance: ${propertyGovernanceAddress}`);

  console.log("\n" + "═".repeat(60));
  console.log("Deployment Complete!");
  console.log("═".repeat(60));

  const addresses = {
    network: network.name, chainId: network.config.chainId, deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    contracts: { InvestorRegistry: investorRegistryAddress, FractionalEstate: fractionalEstateAddress, PropertyGovernance: propertyGovernanceAddress, Treasury: treasury }
  };
  fs.writeFileSync("./deployed-addresses.json", JSON.stringify(addresses, null, 2));
  console.log(`\nAddresses saved to: deployed-addresses.json`);

  console.log("\n📋 Copy to frontend/.env.local:\n");
  console.log(`NEXT_PUBLIC_INVESTOR_REGISTRY_ADDRESS=${investorRegistryAddress}`);
  console.log(`NEXT_PUBLIC_FRACTIONALESTATE_ADDRESS=${fractionalEstateAddress}`);
  console.log(`NEXT_PUBLIC_PROPERTY_GOVERNANCE_ADDRESS=${propertyGovernanceAddress}`);
  
  if (network.name === "arbitrumSepolia") {
    console.log("\n🔍 Verify on Arbiscan:");
    console.log(`npx hardhat verify --network arbitrumSepolia ${investorRegistryAddress}`);
    console.log(`npx hardhat verify --network arbitrumSepolia ${fractionalEstateAddress} "${treasury}" "${investorRegistryAddress}"`);
    console.log(`npx hardhat verify --network arbitrumSepolia ${propertyGovernanceAddress} "${fractionalEstateAddress}"`);
  }
}

main().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); });
