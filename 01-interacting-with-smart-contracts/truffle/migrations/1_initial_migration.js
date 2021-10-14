const Migrations = artifacts.require("Migrations");
const NFT = artifacts.require("NFT");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(NFT);
};
