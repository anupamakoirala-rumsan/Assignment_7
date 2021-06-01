pragma solidity ^0.8.4;
import "contracts/Adoption.sol";

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";

contract TestAdoption{
    Adoption adoption = Adoption(DeployedAddresses.Adoption());
    uint expectedPetId = 7;
    address expectedAdopter= address(this);

function testUserCanAdopt() public{
    uint returnedId = adoption.adpot(expectedPetId);
    Assert.equal(returnedId,expectedPetId,"Sorry");

}   
function testGetAdopter() public{
    address[16] memory adopters = adoption.getadpoters();
    Assert.equal(adopters[expectedPetId],expectedAdopter,"Owner of the pet should be this contract");
} 

}