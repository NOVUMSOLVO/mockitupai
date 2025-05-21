import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  sendPasswordResetEmail,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  serverTimestamp,
  increment,
  deleteDoc
} from "firebase/firestore";
import { auth, db } from './firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userSubscription, setUserSubscription] = useState(null);
  const [createdMockups, setCreatedMockups] = useState([]);
  const [favoritedTemplates, setFavoritedTemplates] = useState([]); // New state for favorited templates

  // Register new user
  async function signup(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
      
      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
        displayName: displayName,
        createdAt: new Date(),
        subscriptionTier: "free", // Default to free tier
        mockupsRemaining: 3, // Free tier starts with 3 mockups
        mockupsCreated: 0,
        favoritedTemplates: [] // Initialize favoritedTemplates
      });
      
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  // Login user
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Login with Google
  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: user.displayName || 'User',
          photoURL: user.photoURL || '',
          createdAt: new Date(),
          subscriptionTier: "free",
          mockupsRemaining: 3,
          mockupsCreated: 0,
          favoritedTemplates: []
        });
      }
      
      return user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  }

  // Login with GitHub
  async function loginWithGithub() {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: user.displayName || 'GitHub User',
          photoURL: user.photoURL || '',
          createdAt: new Date(),
          subscriptionTier: "free",
          mockupsRemaining: 3,
          mockupsCreated: 0,
          favoritedTemplates: []
        });
      }
      
      return user;
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
      throw error;
    }
  }

  // Logout user
  function logout() {
    return signOut(auth);
  }

  // Reset password
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Update subscription
  async function updateSubscription(userId, tier) {
    try {
      const userRef = doc(db, "users", userId);
      let mockupsRemaining = 3; // Default for free tier
      
      if (tier === 'pro') {
        mockupsRemaining = 15;
      } else if (tier === 'unlimited') {
        mockupsRemaining = 999999; // Essentially unlimited
      }
      
      await setDoc(userRef, {
        subscriptionTier: tier,
        mockupsRemaining: mockupsRemaining,
        updatedAt: new Date()
      }, { merge: true });
      
      // Update local subscription state
      setUserSubscription({
        tier: tier,
        mockupsRemaining: mockupsRemaining
      });
      
      return true;
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw error;
    }
  }

  // Get user subscription details
  async function getUserSubscription(userId) {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserSubscription({
          tier: userData.subscriptionTier,
          mockupsRemaining: userData.mockupsRemaining,
          mockupsCreated: userData.mockupsCreated
        });
        setCreatedMockups(userData.createdMockupsHistory || []);
        setFavoritedTemplates(userData.favoritedTemplates || []); // Load favorited templates
        return userData;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user subscription:", error);
      throw error;
    }
  }

  // Update user display name
  async function updateUserDisplayName(newDisplayName) {
    if (!currentUser) {
      throw new Error("No user is currently signed in.");
    }
    if (!newDisplayName || newDisplayName.trim() === "") {
      throw new Error("Display name cannot be empty.");
    }

    try {
      // 1. Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: newDisplayName
      });

      // 2. Update Firestore document
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        displayName: newDisplayName
      });

      // 3. Update local currentUser state
      setCurrentUser(prevUser => ({
        ...prevUser,
        displayName: newDisplayName
      }));

      console.log("Display name updated successfully.");
    } catch (error) {
      console.error("Error updating display name:", error);
      throw error; // Re-throw to be caught by the calling component
    }
  }

  // Delete user account
  async function deleteUserAccount(currentPassword) {
    if (!currentUser || !auth.currentUser) {
      throw new Error("No user is currently signed in.");
    }
    if (!auth.currentUser.email) {
        throw new Error("User email is not available for re-authentication.");
    }

    const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);

    try {
      // 1. Re-authenticate the user
      await reauthenticateWithCredential(auth.currentUser, credential);

      // 2. Delete Firestore user document (and potentially other related data)
      const userRef = doc(db, "users", currentUser.uid);
      await deleteDoc(userRef); 
      // Note: Consider deleting other user-specific data here if necessary
      // e.g., subcollections for mockups, favorites if they are not handled elsewhere.

      // 3. Delete the Firebase Auth user
      await deleteUser(auth.currentUser);
      
      setCurrentUser(null); // Clear local user state
      setUserSubscription(null); // Clear subscription
      setCreatedMockups([]); // Clear mockups
      setFavoritedTemplates([]); // Clear favorites
      console.log("User account deleted successfully.");
      // The component calling this will handle logout and UI changes.

    } catch (error) {
      console.error("Error deleting user account:", error);
      if (error.code === 'auth/wrong-password') {
        throw new Error("Incorrect current password. Please try again.");
      } else if (error.code === 'auth/requires-recent-login') {
        throw new Error("This operation is sensitive and requires recent authentication. Please log out and log back in before trying again.");
      }
      throw new Error(error.message || "Failed to delete account. Please try again.");
    }
  }

  // Decrease mockup count when user creates a mockup
  async function useMockup(userId, templateIdUsed, templateNameUsed, generatedImageUrl) {
    if (!userId) throw new Error("User ID is required to use a mockup.");
    
    const userRef = doc(db, "users", userId);
    
    try {
      const userDocSnap = await getDoc(userRef);
      if (!userDocSnap.exists()) {
        throw new Error("User document not found.");
      }
      
      const userData = userDocSnap.data();
      
      // Check subscription and mockups remaining
      if (userData.subscriptionTier !== "unlimited" && userData.mockupsRemaining <= 0) {
        throw new Error("No mockups remaining for the current billing cycle.");
      }

      const newMockupEntry = {
        templateId: templateIdUsed,
        templateName: templateNameUsed,
        imageUrl: generatedImageUrl, // The URL of the actually generated mockup image
        createdAt: serverTimestamp() // Use Firestore server timestamp
      };

      const updates = {
        mockupsCreated: increment(1),
        createdMockupsHistory: arrayUnion(newMockupEntry)
      };

      if (userData.subscriptionTier !== "unlimited") {
        updates.mockupsRemaining = increment(-1);
      }

      await updateDoc(userRef, updates);

      // Optimistically update local state or re-fetch
      // For simplicity, we'll rely on the next fetch or a manual refresh of userSubscription
      // Or, more robustly, update the local state directly:
      setUserSubscription(prev => ({
        ...prev,
        mockupsCreated: (prev.mockupsCreated || 0) + 1,
        mockupsRemaining: prev.tier !== "unlimited" ? (prev.mockupsRemaining > 0 ? prev.mockupsRemaining -1 : 0) : prev.mockupsRemaining,
      }));
      setCreatedMockups(prev => [newMockupEntry, ...prev]); // Add to local history (note: timestamp will be client-side here)

      console.log("Mockup used successfully. User data updated in Firestore.");
    } catch (error) {
      console.error("Error using mockup:", error);
      throw error; // Re-throw to be caught by the calling function in App.js
    }
  }

  // Add a template to favorites
  async function addFavoriteTemplate(userId, templateId) {
    if (!userId || !templateId) return;
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        favoritedTemplates: arrayUnion(templateId)
      });
      setFavoritedTemplates(prevFavorites => [...prevFavorites, templateId]);
    } catch (error) {
      console.error("Error adding favorite template:", error);
      throw error;
    }
  }

  // Remove a template from favorites
  async function removeFavoriteTemplate(userId, templateId) {
    if (!userId || !templateId) return;
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        favoritedTemplates: arrayRemove(templateId)
      });
      setFavoritedTemplates(prevFavorites => prevFavorites.filter(id => id !== templateId));
    } catch (error) {
      console.error("Error removing favorite template:", error);
      throw error;
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await getUserSubscription(user.uid);
      } else {
        setUserSubscription(null);
        setCreatedMockups([]);
        setFavoritedTemplates([]); // Clear favorites on logout
      }
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userSubscription,
    createdMockups,
    favoritedTemplates,
    loading, // Add loading state to context value
    signup,
    login,
    loginWithGoogle,
    loginWithGithub,
    logout,
    resetPassword,
    updateSubscription,
    getUserSubscription,
    useMockup,
    addFavoriteTemplate,
    removeFavoriteTemplate,
    updateUserDisplayName,
    deleteUserAccount,
    // updateUserPassword, // Assuming this will be added later or is already there
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
