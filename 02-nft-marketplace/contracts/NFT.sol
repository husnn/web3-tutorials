// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {
	constructor() ERC721("Coolest NFT", "NFT") {}

	uint private _tokenId = 0;

	function mint() external returns (uint) {
		_tokenId++;
		_mint(msg.sender, _tokenId);
		return _tokenId;
	}
}