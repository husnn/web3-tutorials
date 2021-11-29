// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IERC721 {
	function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;
}
