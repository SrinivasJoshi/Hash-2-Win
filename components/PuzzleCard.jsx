import React from 'react';
import Link from 'next/link';

const PuzzleCard = ({ puzzle }) => {
	return (
		<div className='bg-orange p-2 text-purple flex flex-col items-center rounded-lg'>
			<h2 className='text-xl py-3 px-2 text-center'>{puzzle.title}</h2>
			<div className='flex text-sm'>
				<p className='mr-3'>
					Price : <strong>{puzzle.prize}</strong> MATIC
				</p>
				<p>Guess Deadline : {puzzle.guessDeadline}</p>
			</div>
			<Link href={`puzzles/${puzzle.id}`}>
				<div className='text-sm mt-3 cursor-pointer bg-purple font-bold text-orange px-3 py-2 rounded-xl'>
					View Puzzle
				</div>
			</Link>
		</div>
	);
};

export default PuzzleCard;
