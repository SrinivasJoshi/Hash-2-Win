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
	const revealDeadline = Math.floor(Date.now() / 1000) + 3000;

	await commitReveal
		.connect(otherAccount1)
		.createPuzzle(_hashAnswer, guessDeadline, revealDeadline, { value: 10 });

	console.log(await commitReveal.totalPuzzles());

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
		expect(await commitReveal.totalPuzzles()).to.equal(2);
	});
});

describe('Submit Commitment', async () => {
	it('Should revert with right error if puzzleId is incorrect', async () => {
		const { commitReveal, otherAccount2 } = await loadFixture(
			deployCommitReveal
		);

		const _hashAnswer2 = await commitReveal.createCommitment(
			otherAccount2.address,
			123456
		);

		await expect(
			commitReveal.connect(otherAccount2).submitCommitment(_hashAnswer2, 3)
		).to.be.revertedWith('Puzzle does not exist');
	});

	it('Should revert with right error if msg.sender is the creator of puzzle', async () => {
		const { commitReveal, otherAccount1 } = await loadFixture(
			deployCommitReveal
		);

		const _hashAnswer2 = await commitReveal.createCommitment(
			otherAccount1.address,
			123456
		);

		await expect(
			commitReveal.connect(otherAccount1).submitCommitment(_hashAnswer2, 0)
		).to.be.revertedWith('Creator of puzzle cannot use this');
	});

	it('Should revert with right error if the submitted late', async () => {
		const { commitReveal, otherAccount2 } = await loadFixture(
			deployCommitReveal
		);

		const _hashAnswer2 = await commitReveal.createCommitment(
			otherAccount2.address,
			123456
		);

		let t = (await time.latest()) + 2000;
		await time.increaseTo(t);

		await expect(
			commitReveal.connect(otherAccount2).submitCommitment(_hashAnswer2, 0)
		).to.be.revertedWith('Late to submit solution to puzzle');
	});

	describe('Reveal', async () => {
		it('Should revert with right error if puzzleId is incorrect', async () => {
			const { commitReveal, otherAccount2 } = await loadFixture(
				deployCommitReveal
			);

			await expect(
				commitReveal.connect(otherAccount2).revealSolution(123, 3)
			).to.be.revertedWith('Puzzle does not exist');
		});

		it('Should revert with right error if submitted by Creator', async () => {
			const { otherAccount1, commitReveal } = await loadFixture(
				deployCommitReveal
			);
			await expect(
				commitReveal.connect(otherAccount1).revealSolution(123, 0)
			).to.be.revertedWith('Creator of puzzle cannot use this');
		});

		it('Should revert with right error if the submitted before guess deadline', async () => {
			const { otherAccount2, commitReveal } = await loadFixture(
				deployCommitReveal
			);
			await expect(
				commitReveal.connect(otherAccount2).revealSolution(123, 0)
			).to.be.revertedWith('Cannot reveal before deadline');
		});

		it('Should revert with right error if the submitted after reveal deadline', async () => {
			const { otherAccount2, commitReveal } = await loadFixture(
				deployCommitReveal
			);
			let t = (await time.latest()) + 4000;
			await time.increaseTo(t);

			await expect(
				commitReveal.connect(otherAccount2).revealSolution(123, 0)
			).to.be.revertedWith('Reveal deadline crossed');
		});

		it('Should revert with right error if the submitted answer does not match hash', async () => {
			const { otherAccount2, commitReveal } = await loadFixture(
				deployCommitReveal
			);
			const _hashAnswer = await commitReveal.createCommitment(
				otherAccount2.address,
				123456
			);
			await commitReveal
				.connect(otherAccount2)
				.submitCommitment(_hashAnswer, 0);
			let t = (await time.latest()) + 1500;
			await time.increaseTo(t);

			await expect(
				commitReveal.connect(otherAccount2).revealSolution(12345, 0)
			).to.be.revertedWith('Answer does not match committed answer');
		});

		it('Should revert with right error if the submitted answer is incorrect', async () => {
			const { otherAccount2, commitReveal } = await loadFixture(
				deployCommitReveal
			);
			const _hashAnswer = await commitReveal.createCommitment(
				otherAccount2.address,
				123456
			);
			await commitReveal
				.connect(otherAccount2)
				.submitCommitment(_hashAnswer, 0);
			let t = (await time.latest()) + 1500;
			await time.increaseTo(t);

			await expect(
				commitReveal.connect(otherAccount2).revealSolution(123456, 0)
			).to.be.revertedWith('Answer is incorrect');
		});

		it('Should revert with right error if the submitted user is already a winner', async () => {
			const { otherAccount2, commitReveal } = await loadFixture(
				deployCommitReveal
			);
			const _hashAnswer = await commitReveal.createCommitment(
				otherAccount2.address,
				12345
			);
			await commitReveal
				.connect(otherAccount2)
				.submitCommitment(_hashAnswer, 0);
			let t = (await time.latest()) + 1500;
			await time.increaseTo(t);

			await commitReveal.connect(otherAccount2).revealSolution(12345, 0);

			await expect(
				commitReveal.connect(otherAccount2).revealSolution(12345, 0)
			).to.be.revertedWith('Already a winner');
		});
	});

	describe('Claim', async () => {
		it('Should revert with right error if puzzleId is incorrect', async () => {
			const { commitReveal, otherAccount2 } = await loadFixture(
				deployCommitReveal
			);

			await expect(
				commitReveal.connect(otherAccount2).claimPrize(3)
			).to.be.revertedWith('Puzzle does not exist');
		});

		it('Should revert with right error if submitted by Creator', async () => {
			const { otherAccount1, commitReveal } = await loadFixture(
				deployCommitReveal
			);
			await expect(
				commitReveal.connect(otherAccount1).claimPrize(0)
			).to.be.revertedWith('Creator of puzzle cannot use this');
		});

		it('Should revert with right error if submitted by a non-winner', async () => {
			const { otherAccount2, commitReveal } = await loadFixture(
				deployCommitReveal
			);
			let t = (await time.latest()) + 3500;
			await time.increaseTo(t);
			await expect(
				commitReveal.connect(otherAccount2).claimPrize(0)
			).to.be.revertedWith('Not a winner');
		});

		it('Should revert with right error if prize already claimed', async () => {
			const { otherAccount2, commitReveal } = await loadFixture(
				deployCommitReveal
			);
			const _hashAnswer = await commitReveal.createCommitment(
				otherAccount2.address,
				12345
			);
			//guess
			await commitReveal
				.connect(otherAccount2)
				.submitCommitment(_hashAnswer, 0);
			let t = (await time.latest()) + 1500;
			await time.increaseTo(t);
			//reveal
			await commitReveal.connect(otherAccount2).revealSolution(12345, 0);
			let t2 = (await time.latest()) + 3500;
			await time.increaseTo(t2);
			await commitReveal.connect(otherAccount2).claimPrize(0);
			await expect(
				commitReveal.connect(otherAccount2).claimPrize(0)
			).to.be.revertedWith('Already claimed');
		});

		it('Should revert with right error if reveal deadline is not complete', async () => {
			const { otherAccount2, commitReveal } = await loadFixture(
				deployCommitReveal
			);
			const _hashAnswer = await commitReveal.createCommitment(
				otherAccount2.address,
				12345
			);
			await commitReveal
				.connect(otherAccount2)
				.submitCommitment(_hashAnswer, 0);
			let t = (await time.latest()) + 1500;
			await time.increaseTo(t);
			await commitReveal.connect(otherAccount2).revealSolution(12345, 0);
			await expect(
				commitReveal.connect(otherAccount2).claimPrize(0)
			).to.be.revertedWith('Reveal deadline not complete');
		});
	});
});
