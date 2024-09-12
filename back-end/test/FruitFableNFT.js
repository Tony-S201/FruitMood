const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const FruitFableNFTContract = await ethers.getContractFactory("FruitFableNFT");
    const nftcontract = await FruitFableNFTContract.deploy(owner.address);

    return { nftcontract, owner, otherAccount };
  }

  describe("Constructor", function () {
    it("Should set the right owner", async function () {
      const { nftcontract, owner } = await loadFixture(deployOneYearLockFixture);

      expect(await nftcontract.owner()).to.equal(owner.address);
    });
  });
});
