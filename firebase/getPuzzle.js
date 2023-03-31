import firebase_app from './config';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore(firebase_app);
export default async function getPuzzle(id) {
	let docRef = doc(db, 'puzzles', id);

	let result = null;
	let error = null;

	try {
		result = await getDoc(docRef);
	} catch (e) {
		error = e;
	}

	return { result, error };
}
