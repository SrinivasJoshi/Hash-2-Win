const hre = require('hardhat');

async function main() {
	const CommitReveal = await hre.ethers.getContractFactory('CommitReveal');
	const commitReveal = await CommitReveal.deploy();

	await lock.deployed();

	console.log(`CommitReveal deployed to ${commitReveal.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
