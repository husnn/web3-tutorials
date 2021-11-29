const Migrations = artifacts.require('Migrations');
const NFT = artifacts.require('NFT');
const Market = artifacts.require('Market');

module.exports = function (deployer) {
	deployer.deploy(Migrations);
	deployer.deploy(NFT);
	deployer.deploy(Market);
};
