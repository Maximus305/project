import { useEffect, useState } from 'react';
import { auth } from './firebase'; // Adjust the path if necessary
 // Corrected import for signOut
import { onAuthStateChanged } from 'firebase/auth';
import { User } from '../types/User'; // Import the User type

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName, // Ensure displayName is set
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  

  return { user, loading, signOut: handleSignOut };
};