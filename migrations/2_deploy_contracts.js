var Election = artifacts.require("./Election.sol");
var Voter = artifacts.require("./Voter.sol");
var Elect = artifacts.require("./Elect.sol");
var Register = artifacts.require("./Register.sol");

module.exports = function(deployer) {
  deployer.deploy(Election);
  deployer.link(Election, Voter, Elect, Register);
  deployer.deploy(Voter);
  deployer.deploy(Elect);
  deployer.deploy(Register);
};