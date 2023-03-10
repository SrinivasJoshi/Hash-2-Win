import React, { useState, useEffect } from 'react';
import Button from '../components/Button';

const Create = () => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [solution, setSolution] = useState(0);
	const [prize, setPrize] = useState(0);
	const [file, setFile] = useState(null);
	const [guessDeadline, setGuessDeadline] = useState('');
	const [revealDeadline, setRevealDeadline] = useState('');
	const [initialDate, setInitialDate] = useState('');

	const formSubmit = (e) => {
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
		//send file to storage and get back fileId and set it in DB

		//Send code to DB
		let doc = {
			title,
			description,
			solution,
			prize,
			guessDeadline,
			revealDeadline,
		};
	};

	useEffect(() => {
		const d = new Date();
		const _initialDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
			.toISOString()
			.slice(0, -8);
		setInitialDate(_initialDate);
		console.log(_initialDate);
	}, []);
	return (
		<div className='flex flex-col items-center bg-purple min-h-screen justify-evenly'>
			<h1 className='text-2xl text-orange font-openSans font-bold'>
				Create Quiz
			</h1>

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
							onChange={(e) => setSolution(e.target.value)}
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
							onChange={(e) => setPrize(e.target.value)}
							type='number'
							id='prize'
							className='border border-gray-300 bg-transparent text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none'
							placeholder='Ex : 10 MATIC'
							required
						/>
					</div>
				</div>
				<div className='mb-6 w-3/6'>
					<label
						className='block mb-2 text-sm font-medium text-white'
						htmlFor='file'>
						Upload question file(Optional)
					</label>
					<input
						onChange={(e) => setFile(e.target.files[0])}
						className='p-2 block w-full text-sm text-white border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none bg-transparent'
						aria-describedby='file_help'
						id='file'
						type='file'
					/>
				</div>
				<div className='mb-6 w-3/6 flex justify-between text-white'>
					<div className='flex flex-col'>
						<label htmlFor='guess_deadline' className='mb-2'>
							Guess Deadline
						</label>
						<input
							onChange={(e) => setGuessDeadline(+new Date(e.target.value))}
							type='datetime-local'
							name='guess_deadline'
							id='guess_deadline'
							min={initialDate}
							className='rounded p-2 border border-1 border-white  bg-transparent'
						/>
					</div>
					<div className='flex flex-col'>
						<label htmlFor='reveal_deadline' className='mb-2'>
							Reveal Deadline
						</label>
						<input
							onChange={(e) => setRevealDeadline(+new Date(e.target.value))}
							type='datetime-local'
							name='reveal_deadline'
							id='reveal_deadline'
							min={initialDate}
							className='rounded p-2 border border-1 border-white  bg-transparent'
						/>
					</div>
				</div>
				<button
					type='submit'
					className='cursor-pointer bg-orange font-bold text-purple px-3 py-2 rounded-3xl'>
					Submit
				</button>
			</form>
		</div>
	);
};

export default Create;
