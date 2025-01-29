import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Configuration is handled through native files
export const db = firestore();
export { auth };
