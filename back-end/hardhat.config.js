require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const RPC_API_KEY = process.env.NETWORK_API_KEY;
const PK = process.env.NETWORK_PK;

module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    arbitrum_sepolia: {
      url: `https://arb-sepolia.g.alchemy.com/v2/${RPC_API_KEY}`,
      accounts: [PK]
    },
    arbitrum: {
      url: `https://arb-mainnet.g.alchemy.com/v2/${RPC_API_KEY}`,
      accounts: [PK]
    }
  },
};
