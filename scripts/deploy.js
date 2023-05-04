const hre = require('hardhat');
require('dotenv').config({ path: '.env' });

async function main() {
	const CommitReveal = await hre.ethers.getContractFactory('CommitReveal');
	const commitReveal = await CommitReveal.deploy();

	await commitReveal.deployed();

	console.log(`CommitReveal deployed to ${commitReveal.address}`);
	console.log('Sleeping.....');
	await sleep(40000);
	await hre.run('verify:verify', {
		address: commitReveal.address,
		constructorArguments: [],
	});
}
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
