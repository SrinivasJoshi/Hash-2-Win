const {
	time,
	loadFixture,
} = require('@nomicfoundation/hardhat-network-helpers');
const hre = require('hardhat');
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');
const { expect } = require('chai');

async function deployCommitReveal() {
	// Contracts are deployed using the first signer/account by default
	const [owner, otherAccount1, otherAccount2, otherAccount3] =
		await hre.ethers.getSigners();

	const CommitReveal = await hre.ethers.getContractFactory('CommitReveal');
	const commitReveal = await CommitReveal.deploy();

	const _hashAnswer = await commitReveal.createCommitment(
		otherAccount1.address,
		12345
	);

	const guessDeadline = Math.floor(Date.now() / 1000) + 1000;
	const revealDeadline = Math.floor(Date.now() / 1000) + 2000;

	return {
		commitReveal,
		owner,
		otherAccount1,
		otherAccount2,
		otherAccount3,
		_hashAnswer,
		guessDeadline,
		revealDeadline,
	};
}

describe('Commit Reveal', () => {
	describe('Deployment', async () => {
		it('Should set the right owner', async () => {
			const { commitReveal, owner } = await loadFixture(deployCommitReveal);
			expect(await commitReveal.owner()).to.equal(owner.address);
		});
	});
});

describe('Creation of Puzzle', async () => {
	it('Should revert with right error if prize is empty', async () => {
		const {
			_hashAnswer,
			guessDeadline,
			revealDeadline,
			commitReveal,
			otherAccount1,
		} = await loadFixture(deployCommitReveal);
		await expect(
			commitReveal
				.connect(otherAccount1)
				.createPuzzle(_hashAnswer, guessDeadline, revealDeadline, { value: 0 })
		).to.be.revertedWith('Prize cannot be empty');
	});

	it('Should revert with right error if deadline is incorrect', async () => {
		const { _hashAnswer, commitReveal, otherAccount1 } = await loadFixture(
			deployCommitReveal
		);
		await expect(
			commitReveal
				.connect(otherAccount1)
				.createPuzzle(_hashAnswer, 12345, 12346, { value: 1 })
		).to.be.revertedWith('Deadline cannot be before current time');
	});

	it('Should revert with right error if deadline is incorrect', async () => {
		const {
			_hashAnswer,
			guessDeadline,
			revealDeadline,
			commitReveal,
			otherAccount1,
		} = await loadFixture(deployCommitReveal);
		await expect(
			commitReveal
				.connect(otherAccount1)
				.createPuzzle(_hashAnswer, revealDeadline, guessDeadline, { value: 1 })
		).to.be.revertedWith('Cannot have guess after reveal');
	});

	it('Should create puzzle with right state changes', async () => {
		const {
			_hashAnswer,
			guessDeadline,
			revealDeadline,
			commitReveal,
			otherAccount1,
		} = await loadFixture(deployCommitReveal);
		await commitReveal
			.connect(otherAccount1)
			.createPuzzle(_hashAnswer, guessDeadline, revealDeadline, { value: 1 });
		expect(await commitReveal.totalPuzzles()).to.equal(1);
	});
});

describe('Submit Commitment', async () => {
	it('Should revert with right error if puzzleId is incorrect', async () => {});

	it('Should revert with right error if msg.sender is the creator of puzzle', async () => {});

	it('Should revert with right error if the submitted late', async () => {});
});
