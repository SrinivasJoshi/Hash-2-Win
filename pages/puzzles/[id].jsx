import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useAccount } from 'wagmi';
import { usePrepareContractWrite, useContractWrite } from 'wagmi';
import { utils } from 'ethers';
import { ABI, CONTRACT_ADDRESS } from '../../constant';
import getPuzzle from '../../firebase/getPuzzle';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const Puzzle = () => {
	//url param stuff
	const router = useRouter();

	//other state
	const { address, isConnected } = useAccount();
	const [solution, setSolution] = useState('');
	const [answer, setAnswer] = useState(0);
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

	const { write: writeSolution } = useContractWrite(submitSolutionConfig);
	const { write: answerReveal } = useContractWrite(answerRevealConfig);
	const { write: claimPrize } = useContractWrite(claimPrizeConfig);

	const submitSolution = () => {
		if (solution.length == 0) {
			toast.warn('Input Empty!', {
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
		setLoading(true);
		writeSolution?.();
		setLoading(false);
	};

	const submitAnswerForReveal = async () => {
		console.log(answer);
		if (!answer) {
			toast.warn('Input Empty!', {
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
		setLoading(true);
		answerReveal?.();
		setLoading(false);
	};
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
		if (submitSolutionError?.reason) {
			console.log(submitSolutionError);
			toast.error(submitSolutionError.reason, {
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
		}
	}, [claimPrizeError]);

	return (
		<section className='bg-purple font-montserrat flex flex-col items-center min-h-screen'>
			<Navbar />
			<div className='text-white flex flex-col items-center justify-around min-h-96 mt-10'>
				<h1 className='text-2xl text-orange font-openSans font-semibold mb-5'>
					{puzzle.title}
				</h1>
				<div className='flex justify-between items-center px-3 my-5'>
					<p className='bg-white text-purple p-2 rounded text-center'>
						Guess Deadline
						<br />
						{new Date(puzzle.guessDeadline * 1000).toLocaleString(undefined, {
							timeZone: 'Asia/Kolkata',
						})}
					</p>
					<h2 className='bg-white text-purple p-2 rounded mx-5 text-center'>
						Price Pool <br /> {puzzle.prize} MATIC
					</h2>

					<p className='bg-white text-purple p-2 rounded text-center'>
						Reveal Deadline
						<br />
						{new Date(puzzle.revealDeadline * 1000).toLocaleString(undefined, {
							timeZone: 'Asia/Kolkata',
						})}
					</p>
				</div>
				<p className='mt-10 text-xl text-bold my-5'>Puzzle description : </p>
				<p className='w-3/5 text-center text-sm'>{puzzle.description}</p>
				{currentTime < puzzle.guessDeadline && (
					<>
						<label htmlFor='solution' className='mt-10'>
							Your answer for commit
						</label>
						<input
							type='number'
							name='solution'
							id='solution'
							min={0}
							onChange={(e) => getHash(e.target.value)}
							className='border mt-3 border-gray-300 bg-transparent text-white text-sm rounded-lg block w-50 p-2.5 focus:outline-none'
						/>
					</>
				)}
				{currentTime < puzzle.revealDeadline &&
					currentTime > puzzle.guessDeadline && (
						<>
							<label htmlFor='answer' className='mt-10'>
								Your answer for reveal
							</label>
							<input
								type='number'
								name='answer'
								id='answer'
								min={0}
								onChange={(e) => setAnswer(e.target.value)}
								className='border mt-3 border-gray-300 bg-transparent text-white text-sm rounded-lg block w-50 p-2.5 focus:outline-none'
							/>
						</>
					)}
			</div>
			{currentTime < puzzle.guessDeadline && (
				<button
					onClick={submitSolution}
					disabled={loading}
					className='mt-10 cursor-pointer bg-orange font-bold text-purple px-3 py-2 rounded-3xl disabled:cursor-not-allowed'>
					Commit Solution
				</button>
			)}
			{currentTime > puzzle.guessDeadline &&
				currentTime < puzzle.revealDeadline && (
					<button
						onClick={submitAnswerForReveal}
						disabled={loading}
						className='mt-10 cursor-pointer bg-orange font-bold text-purple px-3 py-2 rounded-3xl disabled:cursor-not-allowed'>
						Submit Answer for Reveal
					</button>
				)}
			{currentTime > puzzle.revealDeadline && (
				<>
					<h3 className='w-3/5 text-center text-sm text-white mt-5'>
						You can cliam prize if you have are revealed answer and it is
						correct
					</h3>
					<button
						onClick={submitClaimPrize}
						disabled={loading}
						className='mt-10 cursor-pointer bg-orange font-bold text-purple px-3 py-2 rounded-3xl disabled:cursor-not-allowed'>
						Claim Prize
					</button>
				</>
			)}
			{loading && (
				<div role='status' className='mt-5'>
					<svg
						aria-hidden='true'
						className='w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-orange'
						viewBox='0 0 100 101'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<path
							d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
							fill='currentColor'
						/>
						<path
							d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
							fill='currentFill'
						/>
					</svg>
					<span className='sr-only'>Loading...</span>
				</div>
			)}
		</section>
	);
};

export default Puzzle;
