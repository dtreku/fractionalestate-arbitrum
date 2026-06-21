import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0".repeat(64);
const TENDERLY_RPC_URL = process.env.TENDERLY_RPC_URL || "";
const ARBITRUM_SEPOLIA_RPC_URL = process.env.ARBITRUM_SEPOLIA_RPC_URL || "https://sepolia-rollup.arbitrum.io/rpc";
const ARBISCAN_API_KEY = process.env.ARBISCAN_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: { optimizer: { enabled: true, runs: 200 }, viaIR: true },
  },
  networks: {
    hardhat: { chainId: 31337 },
    localhost: { url: "http://127.0.0.1:8545", chainId: 31337 },
    tenderly: { url: TENDERLY_RPC_URL, accounts: [PRIVATE_KEY], chainId: 421614 },
    arbitrumSepolia: { url: ARBITRUM_SEPOLIA_RPC_URL, accounts: [PRIVATE_KEY], chainId: 421614 },
  },
  etherscan: {
    apiKey: ARBISCAN_API_KEY,
  },
  sourcify: {
    enabled: false,
  },
  gasReporter: { enabled: process.env.REPORT_GAS === "true", currency: "USD" },
};
export default config;
