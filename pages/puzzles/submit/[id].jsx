import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { usePrepareContractWrite, useContractWrite } from 'wagmi';
import { utils } from 'ethers';
import { useRouter } from 'next/router';
import PuzzlePage from '../../../components/PuzzlePage';
import getPuzzle from '../../../firebase/getPuzzle';
import { ABI, CONTRACT_ADDRESS } from '../../../constant';
import { watchContractEvent } from '@wagmi/core';
import Router from 'next/router';

const SubmitPuzzle = () => {
	//url param stuff
	const router = useRouter();

	//other state
	const { address, isConnected } = useAccount();
	const [solution, setSolution] = useState(utils.hexZeroPad('0x00', 32));
	const [answer, setAnswer] = useState(0);
	const [puzzleNum, setPuzzleNum] = useState(0);
	const [puzzleId, setPuzzleId] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [puzzle, setPuzzle] = useState(0);
	const [loading, setLoading] = useState(false);

	const unwatch = watchContractEvent(
		{
			address: CONTRACT_ADDRESS,
			abi: ABI,
			eventName: 'GuessCommitted',
			once: true,
		},
		(puzzleId, player) => {
			console.log(`Answer committed to ${puzzleId} by ${player}`);
			setLoading(false);
			Router.push('/puzzles');
		}
	);

	const getHash = (num) => {
		if (!num) {
			return;
		}
		if (!isConnected) {
			alert('Should connect account to enter answer');
		}
		const _hash = utils.solidityKeccak256(
			['address', 'uint256'],
			[address, num + '']
		);
		setSolution(_hash);
	};

	const { config: submitSolutionConfig, error: submitSolutionError } =
		usePrepareContractWrite({
			address: CONTRACT_ADDRESS,
			abi: ABI,
			functionName: 'submitCommitment',
			args: [solution, puzzleNum],
			overrides: {
				from: address,
			},
			chainId: 80001,
		});

	const { write: writeSolution } = useContractWrite(submitSolutionConfig);

	const submitSolution = () => {
		if (solution.length == 0) {
			alert('Input empty!');
			return;
		}
		setLoading(true);
		writeSolution?.();
	};

	const fetchData = async () => {
		let { id } = router.query;
		const divider = id.search('-');
		setPuzzleNum(id.substring(0, divider));
		setPuzzleId(id.substring(divider + 1, id.length));

		const { result, error } = await getPuzzle(
			id.substring(divider + 1, id.length)
		);
		if (error) {
			return console.log(error);
		}
		setPuzzle(result.data());
	};

	useEffect(() => {
		if (!router.isReady) return;
		fetchData();
		setCurrentTime(Math.floor(+new Date() / 1000));
	}, [router.isReady]);

	useEffect(() => {
		if (submitSolutionError?.reason) {
			console.log(submitSolutionError);
			alert(submitSolutionError.reason);
		}
	}, [submitSolutionError]);

	return (
		<PuzzlePage
			puzzle={puzzle}
			mode={'submit'}
			loading={loading}
			getHash={getHash}
			currentTime={currentTime}
			submitSolution={submitSolution}
			setAnswer={setAnswer}
		/>
	);
};

export default SubmitPuzzle;
