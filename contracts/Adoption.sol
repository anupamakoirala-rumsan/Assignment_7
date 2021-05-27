// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
contract Adoption{
    address [16] public adopters;
    function adpot(uint petid) public returns(uint){
        require(petid >=0 && petid <=15);
        adopters[petid] = msg.sender;
        return petid;
    }
    function getadpoters() public view returns (address[16] memory){
        return adopters;
    }
} 