// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FruitFableNFT is ERC1155, Ownable {
    enum Fruit { APPLE, LEMON, ORANGE, PINEAPPLE, STRAWBERRY }
    enum Emotion { ANGRY, HAPPY, SAD, SCARED, SURPRISED }

    mapping(uint256 => uint256) public totalMinted;
    mapping(Fruit => uint256) public ultimateTokenIds;

    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {
        ultimateTokenIds[Fruit.BANANA] = 100;
        ultimateTokenIds[Fruit.APPLE] = 200;
        ultimateTokenIds[Fruit.STRAWBERRY] = 300;
        ultimateTokenIds[Fruit.PINEAPPLE] = 400;
        ultimateTokenIds[Fruit.ORANGE] = 500;
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

    function mergeFruits(Fruit fruit, Emotion[] memory emotions) public {
        require(emotions.length == 5, "Must provide 5 different emotions");

        // Check and burn the 5 tokens of fruits with different emotions
        for (uint256 i = 0; i < emotions.length; i++) {
            uint256 tokenId = getTokenID(fruit, emotions[i]);
            require(balanceOf(msg.sender, tokenId) > 0, "You must own a fruit with this emotion");
            _burn(msg.sender, tokenId, 1); // Burn 1 token from the user
        }

        // Mint the ultimate token for the specified fruit
        uint256 ultimateTokenId = ultimateTokenIds[fruit];
        _mint(msg.sender, ultimateTokenId, 1, 0x); // Use an empty byte value
    }
}