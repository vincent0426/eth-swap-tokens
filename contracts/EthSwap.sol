// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./Token.sol";
import "hardhat/console.sol";

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint public rate = 100;
    address public owner;

    event TokensPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );
    
    event TokensSold(
        address account,
        address token,
        uint amount,
        uint rate
    );
    
    constructor(Token _token) {
        token = _token;
        owner = msg.sender;
    }
    
    function buyTokens() public payable {
        uint tokenAmount = msg.value * rate;
        require(token.balanceOf(address(this)) >= tokenAmount, "Sorry, the pool doesn't have enough tokens");
        
        token.transfer(msg.sender, tokenAmount);
        
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }
    
    function sellTokens(uint _amount) public {
        require(token.balanceOf(msg.sender) >= _amount, "Not Enough Tokens");
        
        uint etherAmount = _amount / rate;
        
        require(address(this).balance >= etherAmount);
        
        token.transferFrom(msg.sender, address(this), _amount);
        payable(msg.sender).transfer(etherAmount);
        
        emit TokensSold(msg.sender, address(token), etherAmount, rate);
    }
}