import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { usePrepareContractWrite, useContractWrite } from 'wagmi';
import { utils } from 'ethers';
import { useRouter } from 'next/router';
import PuzzlePage from '../../../components/PuzzlePage';
import getPuzzle from '../../../firebase/getPuzzle';
import { ABI, CONTRACT_ADDRESS } from '../../../constant';
import { toast } from 'react-toastify';

const SubmitPuzzle = () => {
	//url param stuff
	const router = useRouter();

	//other state
	const { address, isConnected } = useAccount();
	const [solution, setSolution] = useState('');
	const [puzzleNum, setPuzzleNum] = useState(0);
	const [puzzleId, setPuzzleId] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [puzzle, setPuzzle] = useState(0);
	const [loading, setLoading] = useState(false);

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

	const { config: claimPrizeConfig, error: claimPrizeError } =
		usePrepareContractWrite({
			address: CONTRACT_ADDRESS,
			abi: ABI,
			functionName: 'claimPrize',
			args: [puzzleNum],
			overrides: {
				from: address,
			},
			chainId: 80001,
		});

	const { write: claimPrize } = useContractWrite(claimPrizeConfig);

	const submitClaimPrize = async () => {
		setLoading(true);
		claimPrize?.();
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
		if (claimPrizeError?.reason) {
			toast.error(claimPrizeError.reason, {
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
	}, [claimPrizeError]);

	return (
		<PuzzlePage
			puzzle={puzzle}
			mode={'claim'}
			loading={loading}
			getHash={getHash}
			currentTime={currentTime}
			submitClaimPrize={submitClaimPrize}
		/>
	);
};

export default SubmitPuzzle;
