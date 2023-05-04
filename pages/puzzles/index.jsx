import React, { useEffect, useState } from 'react';
import PuzzleCard from '../../components/PuzzleCard';
import Navbar from '../../components/Navbar';
import getAllPuzzles from '../../firebase/getAllPuzzles';

const Puzzles = () => {
	let currentTime = Math.floor(+new Date() / 1000);
	const [puzzles, setPuzzles] = useState([]);
	const [loading, setLoading] = useState(true);
	const fetchData = async () => {
		const { result, error } = await getAllPuzzles();
		if (error) {
			return console.log(error);
		}
		setPuzzles(result.docs);
		setLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<section className='bg-purple font-montserrat flex flex-col items-center min-h-screen'>
			<Navbar />
			<h1 className='text-2xl text-orange font-openSans font-semibold mb-5'>
				Puzzles
			</h1>
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
			{!loading && puzzles.length == 0 && (
				<h2 className='text-xxl text-orange font-openSans font-semibold'>
					No puzzles yet
				</h2>
			)}
			{/* GUESS GRID */}
			{!loading && puzzles.length !== 0 && (
				<h2 className='text-lg text-orange text-bold'>Go Guess Ahead!</h2>
			)}
			<div className='grid grid-cols-3 gap-5 px-5'>
				{puzzles.map((puzzle, i) => {
					if (puzzle.data().guessDeadline > currentTime) {
						return (
							<PuzzleCard
								puzzle={puzzle.data()}
								key={i}
								puzzleNum={puzzles.length - 1 - i}
								docId={puzzle.id}
								mode={'submit'}
							/>
						);
					}
				})}
			</div>

			{/* REVEAL GRID */}
			{!loading && puzzles.length !== 0 && (
				<h2 className='text-lg text-orange text-bold mt-8'>
					Go Reveal your answer!
				</h2>
			)}
			<div className='grid grid-cols-3 gap-5 px-5'>
				{puzzles.map((puzzle, i) => {
					if (
						puzzle.data().guessDeadline < currentTime &&
						puzzle.data().revealDeadline > currentTime
					) {
						return (
							<PuzzleCard
								puzzle={puzzle.data()}
								key={i}
								puzzleNum={puzzles.length - 1 - i}
								docId={puzzle.id}
								mode={'reveal'}
							/>
						);
					}
				})}
			</div>

			{/* CLAIM PRIZE GRID */}
			{!loading && puzzles.length !== 0 && (
				<h2 className='text-lg text-orange text-bold mt-8'>
					Go Cliam your Prize!
				</h2>
			)}
			<div className='grid grid-cols-3 gap-5 px-5'>
				{puzzles.map((puzzle, i) => {
					if (puzzle.data().revealDeadline < currentTime) {
						return (
							<PuzzleCard
								puzzle={puzzle.data()}
								key={i}
								puzzleNum={puzzles.length - 1 - i}
								docId={puzzle.id}
								mode={'claim'}
							/>
						);
					}
				})}
			</div>
		</section>
	);
};

export default Puzzles;
