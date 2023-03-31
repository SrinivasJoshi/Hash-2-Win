import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAccount } from 'wagmi';
import { CONTRACT_ADDRESS, ABI } from '../constant';
import { usePrepareContractWrite, useContractWrite } from 'wagmi';
import { ethers, utils } from 'ethers';
import addData from '../firebase/addData';
import Router from 'next/router';

const Create = () => {
	const { address, isConnected } = useAccount();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [solution, setSolution] = useState('');
	const [prize, setPrize] = useState(0);
	const [guessDeadline, setGuessDeadline] = useState('');
	const [revealDeadline, setRevealDeadline] = useState('');
	const [initialDate, setInitialDate] = useState('');
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
			[address, parseInt(num)]
		);

		setSolution(_hash);
	};

	const { config } = usePrepareContractWrite({
		address: CONTRACT_ADDRESS,
		abi: ABI,
		functionName: 'createPuzzle',
		args: [solution, guessDeadline, revealDeadline],
		overrides: {
			from: address,
			value: ethers.utils.parseEther(prize + ''),
		},
		chainId: 80001,
	});

	const { write } = useContractWrite(config);

	const formSubmit = async (e) => {
		setLoading(true);
		//validation
		e.preventDefault();
		if (solution < 0) {
			alert('Solution cannot be less than 0');
			return;
		}
		if (prize <= 0) {
			alert('Prize cannot be less than 0 or 0');
			return;
		}
		if (revealDeadline < guessDeadline) {
			alert('Reveal dealine should be after Guess deadline');
			return;
		}
		//Send code to DB
		let doc = {
			title,
			description,
			solution,
			prize,
			guessDeadline,
			revealDeadline,
		};
		console.log(doc);
		const { result, error } = await addData(address, doc);
		if (error) {
			return console.log(error);
		}

		//write to smart contract
		write?.();
		setLoading(false);
		Router.push('/puzzles');
	};

	useEffect(() => {
		const d = new Date();
		const _initialDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
			.toISOString()
			.slice(0, -8);
		setInitialDate(_initialDate);
	}, []);

	return (
		<div className='flex flex-col items-center bg-purple min-h-screen'>
			<Navbar />
			<h1 className='text-2xl text-orange font-openSans font-bold mb-5'>
				Create Quiz
			</h1>
			{isConnected && (
				<form
					onSubmit={formSubmit}
					className='font-montserrat w-full flex flex-col items-center justify-evenly'>
					<div className='mb-6 w-3/6'>
						<label
							htmlFor='title'
							className='block mb-2 text-sm font-medium text-white'>
							Title
						</label>
						<input
							onChange={(e) => setTitle(e.target.value)}
							type='title'
							id='title'
							className='border border-gray-300 bg-transparent text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none'
							placeholder='Ex : Euler and his uncrackable Q'
							required
						/>
					</div>
					<div className='mb-6 w-3/6'>
						<label
							htmlFor='description'
							className='block mb-2 text-sm font-medium text-white'>
							Description
						</label>
						<textarea
							onChange={(e) => setDescription(e.target.value)}
							className='border border-gray-300 bg-transparent text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none'
							name='description'
							id='description'
							cols='30'
							rows='8'
							required
							placeholder='Ex : Lorem Ipsum...'></textarea>
					</div>
					<div className='mb-6 w-3/6 flex'>
						<div className='w-1/2 mr-3'>
							<label
								htmlFor='solution'
								className='block mb-2 text-sm font-medium text-white'>
								Solution
							</label>
							<input
								onChange={(e) => getHash(e.target.value)}
								type='number'
								id='solution'
								className='border border-gray-300 bg-transparent text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none'
								placeholder='Ex : 12345'
								required
								min={0}
							/>
						</div>

						<div className='w-1/2'>
							<label
								htmlFor='prize'
								className='block mb-2 text-sm font-medium text-white'>
								Prize
							</label>
							<input
								onChange={(e) => {
									if (!e.target.value) {
										return;
									}
									setPrize(e.target.value);
								}}
								type='number'
								step='0.0001'
								id='prize'
								className='border border-gray-300 bg-transparent text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none'
								placeholder='Ex : 10 MATIC'
								required
							/>
						</div>
					</div>

					<div className='mb-6 w-3/6 flex justify-between text-white'>
						<div className='flex flex-col w-1/2 mr-3'>
							<label htmlFor='guess_deadline' className='mb-2'>
								Guess Deadline
							</label>
							<input
								onChange={(e) =>
									setGuessDeadline(Math.floor(+new Date(e.target.value) / 1000))
								}
								type='datetime-local'
								name='guess_deadline'
								id='guess_deadline'
								min={initialDate}
								className='rounded-lg p-2 border border-1 border-gray-300  bg-transparent'
							/>
						</div>
						<div className='flex flex-col w-1/2'>
							<label htmlFor='reveal_deadline' className='mb-2'>
								Reveal Deadline
							</label>
							<input
								onChange={(e) =>
									setRevealDeadline(
										Math.floor(+new Date(e.target.value) / 1000)
									)
								}
								type='datetime-local'
								name='reveal_deadline'
								id='reveal_deadline'
								min={initialDate}
								className='rounded-lg p-2 border border-1 border-gray-300 bg-transparent'
							/>
						</div>
					</div>
					<button
						type='submit'
						disabled={loading}
						className='cursor-pointer bg-orange font-bold text-purple px-3 py-2 rounded-3xl'>
						Submit
					</button>
				</form>
			)}
			{!isConnected && (
				<h1 className='text-white text-lg mt-5'>
					Connect with metamask to take a quiz
				</h1>
			)}
		</div>
	);
};

export default Create;
