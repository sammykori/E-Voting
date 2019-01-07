var Election = artifacts.require("./Election.sol");
var Voter = artifacts.require("./Voter.sol");

module.exports = function(deployer) {
  deployer.deploy(Election);
  deployer.link(Election, Voter);
  deployer.deploy(Voter);
};