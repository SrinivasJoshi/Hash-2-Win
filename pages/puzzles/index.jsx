import React, { useEffect, useState } from 'react';
import PuzzleCard from '../../components/PuzzleCard';
import Navbar from '../../components/Navbar';
import getAllPuzzles from '../../firebase/getAllPuzzles';

const Puzzles = () => {
	let currentTime = Math.floor(+new Date() / 1000);
	const [puzzles, setPuzzles] = useState([]);
	const fetchData = async () => {
		const { result, error } = await getAllPuzzles();
		if (error) {
			return console.log(error);
		}
		setPuzzles(result.docs);
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
			{puzzles.length == 0 && (
				<h2 className='text-xxl text-orange font-openSans font-semibold'>
					No new puzzles
				</h2>
			)}
			{/* GUESS GRID */}
			<h2 className='text-lg text-orange text-bold'>Go Guess Ahead!</h2>
			<div className='grid grid-cols-3 gap-5 px-5'>
				{puzzles.map((puzzle, i) => {
					if (puzzle.data().guessDeadline > currentTime) {
						return (
							<PuzzleCard
								puzzle={puzzle.data()}
								key={i}
								puzzleNum={i}
								docId={puzzle.id}
							/>
						);
					}
				})}
			</div>

			{/* REVEAL GRID */}
			<h2 className='text-lg text-orange text-bold mt-8'>
				Go Reveal your answer!
			</h2>
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
								puzzleNum={i}
								docId={puzzle.id}
							/>
						);
					}
				})}
			</div>

			{/* CLAIM PRIZE GRID */}
			<h2 className='text-lg text-orange text-bold mt-8'>
				Go Cliam your Prize!
			</h2>
			<div className='grid grid-cols-3 gap-5 px-5'>
				{puzzles.map((puzzle, i) => {
					if (puzzle.data().revealDeadline < currentTime) {
						return (
							<PuzzleCard
								puzzle={puzzle.data()}
								key={i}
								puzzleNum={i}
								docId={puzzle.id}
							/>
						);
					}
				})}
			</div>
		</section>
	);
};

export default Puzzles;
