var Election = artifacts.require("./Election.sol");
var Elect = artifacts.require("./Elect.sol");
var Register = artifacts.require("./Register.sol");

module.exports = function(deployer) {
  deployer.deploy(Election);
  deployer.link(Election, Elect, Register);
  deployer.deploy(Elect);
  deployer.deploy(Register);
};