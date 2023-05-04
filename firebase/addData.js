import firebase_app from './config';
import { getFirestore, addDoc, collection } from 'firebase/firestore';

const db = getFirestore(firebase_app);
export default async function addData(data) {
	let result = null;
	let error = null;

	try {
		result = await addDoc(collection(db, 'puzzles'), data);
		console.log('Document written with ID: ', result.id);
	} catch (err) {
		error = err;
	}

	return { result, error };
}
