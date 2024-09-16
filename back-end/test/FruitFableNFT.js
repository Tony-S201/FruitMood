const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

const Fruit = {
  APPLE: 0,
  LEMON: 1,
  ORANGE: 2,
  PINEAPPLE: 3,
  STRAWBERRY: 4
};

const Emotion = {
  ANGRY: 0,
  HAPPY: 1,
  SAD: 2,
  SCARED: 3,
  SURPRISED: 4
};

function getTokenId(fruit, emotion) {
  return fruit * 10 + emotion;
}

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployNFTFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const FruitFableNFTContract = await ethers.getContractFactory("FruitFableNFT");
    const nftcontract = await FruitFableNFTContract.deploy(owner.address);

    return { nftcontract, owner, otherAccount };
  }

  describe("Constructor", function () {
    it("Should set the right owner", async function () {
      const { nftcontract, owner } = await loadFixture(deployNFTFixture);

      expect(await nftcontract.owner()).to.equal(owner.address);
    });
    it("Should set the ultimateTokenIds for each fruit", async function () {
      const { nftcontract } = await loadFixture(deployNFTFixture);

      expect(await nftcontract.ultimateTokenIds(0)).to.equal(100);
      expect(await nftcontract.ultimateTokenIds(1)).to.equal(200);
      expect(await nftcontract.ultimateTokenIds(2)).to.equal(300);
      expect(await nftcontract.ultimateTokenIds(3)).to.equal(400);
      expect(await nftcontract.ultimateTokenIds(4)).to.equal(500);
    });
  });

  describe("URI", function () {
    it("Only owner should set the URI", async function () {
      const { nftcontract, owner, otherAccount } = await loadFixture(deployNFTFixture);

      await expect(nftcontract.connect(otherAccount).setURI("test"))
        .to.be.revertedWithCustomError(nftcontract, 'OwnableUnauthorizedAccount');

      await expect(nftcontract.connect(owner).setURI("test"))
        .to.not.be.reverted;
    });
    it("URI should be changed by the owner", async function () {
      const { nftcontract, owner } = await loadFixture(deployNFTFixture);

      await expect(nftcontract.connect(owner).setURI("changed"))
        .to.not.be.reverted;

      const URI = await nftcontract.uri(0);
      expect(URI).to.equal("changed");
    });
  });

  describe("TokenId", function () {
    for (let fruit in Fruit) {
      for (let emotion in Emotion) {
        const fruitValue = Fruit[fruit];
        const emotionValue = Emotion[emotion];
        const expectedTokenId = getTokenId(fruitValue, emotionValue);

        it(`Should return correct tokenId for ${fruit} and ${emotion}`, async function () {
          const { nftcontract } = await loadFixture(deployNFTFixture);
          const tokenId = await nftcontract.getTokenId(fruitValue, emotionValue);
          expect(tokenId).to.equal(expectedTokenId);
        });
      }
    }
  });

  describe("Mint", function () {
    it("Should mint all items without error", async function () {
      const { nftcontract, otherAccount } = await loadFixture(deployNFTFixture);

      for (let fruit in Fruit) {
        for (let emotion in Emotion) {
          const fruitValue = Fruit[fruit];
          const emotionValue = Emotion[emotion];
          // Mint
          await expect(nftcontract.connect(otherAccount).mint(fruitValue, emotionValue, 1, "0x"))
            .to.not.be.reverted;
        }
      }
    });

    it("Should increment the total minted for each item", async function () {
      const { nftcontract, otherAccount } = await loadFixture(deployNFTFixture);

      for (let fruit in Fruit) {
        for (let emotion in Emotion) {
          const fruitValue = Fruit[fruit];
          const emotionValue = Emotion[emotion];
          // Mint
          await expect(nftcontract.connect(otherAccount).mint(fruitValue, emotionValue, 1, "0x"))
            .to.not.be.reverted;
          // Check total minted
          const totalMinted = await nftcontract.totalMinted(getTokenId(fruitValue, emotionValue));
          expect(totalMinted).to.be.equal(1); 
        }
      }
    });

    it("Should increment the balance of user for each item", async function () {
      const { nftcontract, otherAccount } = await loadFixture(deployNFTFixture);

      for (let fruit in Fruit) {
        for (let emotion in Emotion) {
          const fruitValue = Fruit[fruit];
          const emotionValue = Emotion[emotion];
          // Mint
          await expect(nftcontract.connect(otherAccount).mint(fruitValue, emotionValue, 1, "0x"))
            .to.not.be.reverted;
          // Check balance
          const itemBalance = await nftcontract.balanceOf(otherAccount.address, getTokenId(fruitValue, emotionValue));
          expect(itemBalance).to.be.equal(1);
        }
      }
    });

    it("Should emit an event on mint", async function () {
      const { nftcontract, otherAccount } = await loadFixture(deployNFTFixture);

      await expect(nftcontract.connect(otherAccount).mint(0, 0, 1, "0x"))
        .to.emit(nftcontract, "TransferSingle");
    });
    
  });

  describe("Merge", function () {
    it("Should merge fruits if user merge 5 emotions of 1 type of fruit", async function () {
      const { nftcontract, otherAccount } = await loadFixture(deployNFTFixture);

      // Mint 5 emotions of 1 type of fruit.
      for(let i = 0; i <= 4; i++) {
        await nftcontract.connect(otherAccount).mint(0, i, 1, "0x");
      }

      // Merge fruits.
      await expect(nftcontract.connect(otherAccount).mergeFruits(0))
        .to.not.be.reverted;
    });

    it("Should revert if the user doesnt have the 5 emotions of the fruit", async function () {
      const { nftcontract, otherAccount } = await loadFixture(deployNFTFixture);

      // Mint only 4 emotions of 1 type of fruit.
      for(let i = 0; i <= 3; i++) {
        await nftcontract.connect(otherAccount).mint(0, i, 1, "0x");
      }

      // Merge fruits.
      await expect(nftcontract.connect(otherAccount).mergeFruits(0))
        .to.be.revertedWith("You must own a fruit with this emotion");
    });

    it("Should burn the tokens after merging", async function () {
      const { nftcontract, otherAccount } = await loadFixture(deployNFTFixture);

      // Mint 5 emotions of 1 type of fruit.
      for(let i = 0; i <= 4; i++) {
        await nftcontract.connect(otherAccount).mint(0, i, 1, "0x");
      }

      // Merge fruits.
      await nftcontract.connect(otherAccount).mergeFruits(0);

      // Check if fruits are burned.
      for(let i = 0; i <= 4; i++) {
        const itemBalance = await nftcontract.balanceOf(otherAccount.address, getTokenId(0, i));
        expect(itemBalance).to.be.equal(0);
      }
    });

    it("Should generate the ultimate token after merging the 5 emotions", async function () {
      const { nftcontract, otherAccount } = await loadFixture(deployNFTFixture);

      // Mint 5 emotions of 1 type of fruit.
      for(let i = 0; i <= 4; i++) {
        await nftcontract.connect(otherAccount).mint(0, i, 1, "0x");
      }

      // Merge fruits.
      await nftcontract.connect(otherAccount).mergeFruits(0);

      // Check if the ultimate token is correctly minted.
      const itemBalance = await nftcontract.balanceOf(otherAccount.address, 100);
      expect(itemBalance).to.be.equal(1);
    });

    it("Should generate the ultimate token for all type of fruits", async function () {
      const { nftcontract, otherAccount } = await loadFixture(deployNFTFixture);

      // Mint all fruits.
      for (let fruit in Fruit) {
        for (let emotion in Emotion) {
          const fruitValue = Fruit[fruit];
          const emotionValue = Emotion[emotion];

          // Mint
          await nftcontract.connect(otherAccount).mint(fruitValue, emotionValue, 1, "0x")
        }
      }

      // Merge fruits.
      for (let i = 0; i <= 4; i++) {
        await nftcontract.connect(otherAccount).mergeFruits(i);

        // Check ultimate tokens in user balance.
        const currentUltimateTokenId = await nftcontract.ultimateTokenIds(i);
        const itemBalance = await nftcontract.balanceOf(otherAccount.address, currentUltimateTokenId);
        expect(itemBalance).to.be.equal(1);
      }  
    });

  });
});
