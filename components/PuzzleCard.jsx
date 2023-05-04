import React from 'react';
import Link from 'next/link';

const PuzzleCard = ({ puzzle, puzzleNum, docId, mode }) => {
	let currentTime = Math.floor(+new Date() / 1000);
	let _date;
	if (currentTime < puzzle.guessDeadline) {
		_date = new Date(puzzle.guessDeadline * 1000).toLocaleString(undefined, {
			timeZone: 'Asia/Kolkata',
		});
	} else {
		_date = new Date(puzzle.revealDeadline * 1000).toLocaleString(undefined, {
			timeZone: 'Asia/Kolkata',
		});
	}

	return (
		<div className='bg-orange p-2 text-purple flex flex-col items-center rounded-lg w-80'>
			<h2 className='text-xl py-3 px-2 text-center'>{puzzle.title}</h2>
			<div className='flex flex-col items-center text-sm'>
				<p className='mr-3'>
					Price : <strong>{puzzle.prize}</strong> MATIC
				</p>
				{currentTime < puzzle.guessDeadline && <p>Guess Deadline : {_date}</p>}
				{currentTime < puzzle.revealDeadline &&
					currentTime > puzzle.guessDeadline && (
						<p>Reveal Deadline : {_date}</p>
					)}
			</div>
			<Link href={`puzzles/${mode}/${puzzleNum}-${docId}`}>
				<div className='text-sm mt-3 cursor-pointer bg-purple font-bold text-orange px-3 py-2 rounded-xl'>
					View Puzzle
				</div>
			</Link>
		</div>
	);
};

export default PuzzleCard;
