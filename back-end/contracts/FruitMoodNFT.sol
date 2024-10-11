// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FruitMoodNFT is ERC1155, Ownable {
    enum Fruit { APPLE, LEMON, ORANGE, PINEAPPLE, STRAWBERRY }
    enum Emotion { ANGRY, HAPPY, SAD, SCARED, SHOKED }

    mapping(uint256 => uint256) public totalMinted;
    mapping(Fruit => uint256) public ultimateTokenIds;

    string public name;
    string public symbol;

    constructor(address initialOwner) ERC1155("ipfs://QmbP8C32B2mpjQFkRXmZu5J7SCacUtg13khmDBYvUQ17gJ/{id}.json") Ownable(initialOwner) {
        name = "FruitMood Collection";
        symbol = "FMT";
        ultimateTokenIds[Fruit.APPLE] = 100;
        ultimateTokenIds[Fruit.LEMON] = 200;
        ultimateTokenIds[Fruit.ORANGE] = 300;
        ultimateTokenIds[Fruit.PINEAPPLE] = 400;
        ultimateTokenIds[Fruit.STRAWBERRY] = 500;
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function getTokenId(Fruit fruit, Emotion emotion) public pure returns(uint256) {
        return uint256(fruit) * 10 + uint256(emotion);
    }

    function mint(Fruit fruit, Emotion emotion, uint256 amount, bytes memory data) public {
        uint256 id = getTokenId(fruit, emotion);
        _mint(msg.sender, id, amount, data);
        totalMinted[id] += amount;
    }

    function mergeFruits(Fruit fruit) public {
        // Check and burn the 5 tokens of fruits with different emotions
        for (uint256 i = 0; i <= 4; i++) {
            Emotion emotion = Emotion(i); // Convert index to emotion
            uint256 tokenId = getTokenId(fruit, emotion);
            require(balanceOf(msg.sender, tokenId) > 0, "You must collect all 5 emotion traits of the same fruit NFT to perform the merge.");
            _burn(msg.sender, tokenId, 1); // Burn 1 token from the user
        }

        // Mint the ultimate token for the specified fruit
        uint256 ultimateTokenId = ultimateTokenIds[fruit];
        _mint(msg.sender, ultimateTokenId, 1, "0x"); // Use an empty byte value
    }
}