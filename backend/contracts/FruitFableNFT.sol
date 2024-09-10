// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FruitFableNFT is ERC1155, Ownable {
    enum Fruit { APPLE, LEMON, ORANGE, PINEAPPLE, STRAWBERRY }
    enum Emotion { ANGRY, HAPPY, SAD, SCARED, SURPRISED }

    mapping(uint256 => uint256) public totalMinted;

    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {}

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
}