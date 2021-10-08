pragma solidity ^0.8.0;

import @openzeppelin-contracts/contracts/token/ERC20/ERC20.sol;


contract Token is  ERC20 {
    constructor (string memory name, string memory symbol)
        ERC20(name, symbol)
        public
    {
        // Mint 10 000 tokens to msg.sender
        _mint(msg.sender, 10000 * 10 ** uint(decimals()));
    }
}
