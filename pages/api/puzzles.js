import clientPromise from '../../mongodb';

export default async (req, res) => {
	try {
		const client = await clientPromise;
		const db = client.db('commitReveal');
		switch (req.method) {
			case 'POST':
				let bodyObject = JSON.parse(req.body);
				let myPost = await db.collection('puzzles').insertOne(bodyObject);
				res.json(myPost.ops[0]);
				break;
			case 'GET':
				const puzzles = await db.collection('puzzles').find({}).toArray();
				res.json({ status: 200, data: puzzles });
				break;
		}
	} catch (error) {
		console.log(error);
	}
};
