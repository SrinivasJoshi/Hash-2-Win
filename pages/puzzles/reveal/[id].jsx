import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { usePrepareContractWrite, useContractWrite } from 'wagmi';
import { utils } from 'ethers';
import { useRouter } from 'next/router';
import PuzzlePage from '../../../components/PuzzlePage';
import getPuzzle from '../../../firebase/getPuzzle';
import { ABI, CONTRACT_ADDRESS } from '../../../constant';
import { watchContractEvent } from '@wagmi/core';
import { toast } from 'react-toastify';

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
			eventName: 'WinnerOfPuzzle',
			once: true,
		},
		(puzzleId, winner) => {
			toast.success('You are the winner of this puzzle', {
				position: 'top-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: 'dark',
			});
			console.log(puzzleId, winner);
			setLoading(false);
		}
	);

	const getHash = (num) => {
		if (!num) {
			return;
		}
		if (!isConnected) {
			toast.warn(`Connect web3 wallet to answer puzzle`, {
				position: 'top-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: 'dark',
			});
		}
		const _hash = utils.solidityKeccak256(
			['address', 'uint256'],
			[address, num + '']
		);
		setSolution(_hash);
	};

	const { config: answerRevealConfig, error: answerRevealError } =
		usePrepareContractWrite({
			address: CONTRACT_ADDRESS,
			abi: ABI,
			functionName: 'revealSolution',
			args: [answer, puzzleNum],
			overrides: {
				from: address,
			},
			chainId: 80001,
		});
	const { write: answerReveal } = useContractWrite(answerRevealConfig);

	const submitAnswerForReveal = async () => {
		console.log(answer);
		if (!answer) {
			toast.error('Input empty!', {
				position: 'top-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: 'dark',
			});
			return;
		}
		if (answerRevealError?.reason) {
			toast.error(answerRevealError.reason, {
				position: 'top-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: 'dark',
			});
			setLoading(false);
			return;
		}
		setLoading(true);
		answerReveal?.();
		setLoading(false);
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
		if (
			answerRevealError?.reason &&
			answerRevealError.reason !==
				'execution reverted: Answer does not match committed answer'
		) {
			toast.error(answerRevealError.reason, {
				position: 'top-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: 'dark',
			});
			setLoading(false);
		}
	}, [answerRevealError]);

	return (
		<PuzzlePage
			puzzle={puzzle}
			mode={'reveal'}
			loading={loading}
			getHash={getHash}
			currentTime={currentTime}
			setAnswer={setAnswer}
			submitAnswerForReveal={submitAnswerForReveal}
		/>
	);
};

export default SubmitPuzzle;
