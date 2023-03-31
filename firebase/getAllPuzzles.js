import firebase_app from './config';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';

const db = getFirestore(firebase_app);
export default async function getAllPuzzles() {
	let result = null;
	let error = null;

	try {
		result = await getDocs(collection(db, 'puzzles'));
	} catch (e) {
		error = e;
	}

	return { result, error };
}
