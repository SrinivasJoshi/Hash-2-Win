import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';

const Puzzle = () => {
	const [puzzle, setPuzzle] = useState({});

	useEffect(() => {
		//fetch the puzzles
		let obj = {};
		setPuzzle(obj);
	}, []);

	return (
		<section className='bg-purple font-montserrat flex flex-col items-center min-h-screen'>
			<Navbar />
			<h1 className='text-2xl text-orange font-openSans font-semibold mb-5'>
				Puzzle #{puzzle.id}
			</h1>
		</section>
	);
};

export default Puzzle;

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
