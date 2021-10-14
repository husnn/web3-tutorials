// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenId;
    
    constructor() ERC721('TestNFT', 'TEST') {}

    function mint(address owner) public {
        _tokenId.increment();

        uint256 newTokenID = _tokenId.current();
        _mint(owner, newTokenID);
    }
}