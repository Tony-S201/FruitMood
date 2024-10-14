require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const ALCHEMY_API_KEY = process.env.NETWORK_API_KEY;
const PK = process.env.NETWORK_PK;

module.exports = {
  solidity: "0.8.24",
  defaultNetwork: "hardhat",
  networks: {
    arbitrum_sepolia: {
      url: `https://arb-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [PK]
    },
    arbitrum: {
      url: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [PK]
    }
  },
};
