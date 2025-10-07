import auth from '@react-native-firebase/auth';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Export auth instance
export { auth };

// Helper function to get current user
export const getCurrentUser = (): FirebaseAuthTypes.User | null => {
  return auth().currentUser;
};

// Helper for auth state listener
export const onAuthStateChanged = (callback: (user: FirebaseAuthTypes.User | null) => void) => {
  return auth().onAuthStateChanged(callback);
};