const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const hre = require("hardhat");

describe("NFT Tests", function () {
  async function deployNFTFixture() {
    const [owner, addr1] = await hre.ethers.getSigners();
    const FruitFableNFT = await hre.ethers.getContractFactory("FruitFableNFT.sol");

    // Deploy strategy factory
    const fruitnft = await FruitFableNFT.deploy();

    return { fruitnft, owner, addr1 };
  }

  describe("NFT contract constructor", function() {
    it("should revert if creator address is zero", async function() {
      const FruitFableNFT = await hre.ethers.getContractFactory("FruitFableNFT");
  
      // Try to deploy contract as zero address
      await expect(
        FruitFableNFT.deploy(hre.ethers.ZeroAddress)
      ).to.be.revertedWith("Creator address cannot be zero");
    })
  })

  describe("Initialize NFT contract", function() {
    it("Should have variables", async function() {
      const { fruitnft, vault, owner } = await loadFixture(deployNFTFixture);

      // Check creator
      expect(await fruitnft.creator())
        .to.be.equal(owner.address);
    })
  })

});