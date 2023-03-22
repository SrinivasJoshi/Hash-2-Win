import React, { useEffect, useState } from 'react';
import PuzzleCard from '../../components/PuzzleCard';
import Navbar from '../../components/Navbar';
import clientPromise from '../../mongodb';

const Puzzles = ({ puzzless }) => {
	const [puzzles, setPuzzles] = useState([]);

	useEffect(() => {
		//fetch the puzzles
		let obj = [
			{
				id: 0,
				title:
					'If three birds are sitting on a wire and you shoot one, how many birds are left on the wire?',
				prize: 10,
				guessDeadline: '12345',
			},
			{
				id: 1,
				title:
					'MaMary’s father has five daughters: 1. Betty, 2. Irene, 3. Anna, 4. Emma.What’s the the name of the fifth daughter?',
				prize: 12,
				guessDeadline: '123345',
			},
			{
				id: 2,
				title:
					'You ran a race and passed the person in second place. What place would you be in now?',
				prize: 10,
				guessDeadline: '142345',
			},
		];
		setPuzzles(obj);
	}, []);

	return (
		<section className='bg-purple font-montserrat flex flex-col items-center min-h-screen'>
			<Navbar />
			<h1 className='text-2xl text-orange font-openSans font-semibold mb-5'>
				Puzzles
			</h1>
			<div className='grid grid-cols-3 gap-5 px-5'>
				{puzzles.map((puzzle, i) => {
					return <PuzzleCard puzzle={puzzle} key={i} />;
				})}
			</div>
		</section>
	);
};

export default Puzzles;

export async function getServerSideProps() {
	try {
		const client = await clientPromise;
		const db = client.db('commitReveal');

		const puzzles = await db.collection('puzzles').find({}).toArray();

		return {
			props: { puzzles: JSON.parse(JSON.stringify(puzzles)) },
		};
	} catch (e) {
		console.error(e);
	}
}
