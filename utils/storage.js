import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile as updateFirebaseProfile,
} from "firebase/auth";
import { auth } from "./firebase";

const PROFILE_KEY = "firebase_user_profiles";

function friendlyAuthError(error) {
  const code = error?.code || "";

  if (code.includes("email-already-in-use")) return "Email is already registered.";
  if (code.includes("invalid-email")) return "Please enter a valid email address.";
  if (code.includes("invalid-credential")) return "Invalid email or password.";
  if (code.includes("weak-password")) return "Password should be at least 6 characters.";
  if (code.includes("popup-closed-by-user")) return "Google sign-in was cancelled.";
  if (code.includes("operation-not-allowed")) {
    return "This sign-in method is not enabled in Firebase Authentication.";
  }

  return error?.message || "Authentication failed. Please try again.";
}

async function getProfiles() {
  try {
    const value = await AsyncStorage.getItem(PROFILE_KEY);
    return value ? JSON.parse(value) : {};
  } catch (error) {
    console.error("Error loading profiles:", error);
    return {};
  }
}

async function saveProfile(uid, profile) {
  const profiles = await getProfiles();
  const nextProfile = { ...profiles[uid], ...profile, uid };

  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify({ ...profiles, [uid]: nextProfile }));
  return nextProfile;
}

function formatUser(firebaseUser, profile = {}) {
  const [firstName = "", ...restName] = (firebaseUser.displayName || "").split(" ");

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    firstName: profile.firstName ?? firstName,
    lastName: profile.lastName ?? restName.join(" "),
    profilePhoto: profile.profilePhoto ?? firebaseUser.photoURL ?? null,
    providerId: firebaseUser.providerData?.[0]?.providerId || "password",
  };
}

async function ensureProfile(firebaseUser, defaults = {}) {
  const profiles = await getProfiles();
  const existingProfile = profiles[firebaseUser.uid] || {};
  const profile = await saveProfile(firebaseUser.uid, {
    email: firebaseUser.email,
    firstName: "",
    lastName: "",
    profilePhoto: firebaseUser.photoURL || null,
    ...defaults,
    ...existingProfile,
  });

  return formatUser(firebaseUser, profile);
}

function getAuthUser() {
  if (auth.currentUser) return Promise.resolve(auth.currentUser);

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

export const saveUser = async (userData) => {
  try {
    const credential = await createUserWithEmailAndPassword(auth, userData.email.trim(), userData.password);
    const user = await ensureProfile(credential.user, {
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      profilePhoto: userData.profilePhoto || null,
    });

    return { success: true, message: "User registered successfully", user };
  } catch (error) {
    return { success: false, error: friendlyAuthError(error) };
  }
};

export const loginUser = async (email, password) => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = await ensureProfile(credential.user);

    return { success: true, user };
  } catch (error) {
    return { success: false, error: friendlyAuthError(error) };
  }
};

export const signInWithGoogleAccount = async () => {
  if (Platform.OS !== "web") {
    return {
      success: false,
      error:
        "Google sign-in is ready for web. For Android or iOS, add Google OAuth client IDs and connect them with Expo AuthSession.",
    };
  }

  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    const credential = await signInWithPopup(auth, provider);
    const user = await ensureProfile(credential.user, {
      firstName: credential.user.displayName?.split(" ")[0] || "",
      lastName: credential.user.displayName?.split(" ").slice(1).join(" ") || "",
      profilePhoto: credential.user.photoURL || null,
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: friendlyAuthError(error) };
  }
};

export const getCurrentUser = async () => {
  const firebaseUser = await getAuthUser();
  if (!firebaseUser) return null;

  return ensureProfile(firebaseUser);
};

export const updateUserProfile = async (_email, updates) => {
  try {
    const firebaseUser = await getAuthUser();

    if (!firebaseUser) {
      throw new Error("Please log in again before updating your profile.");
    }

    const displayName = `${updates.firstName || ""} ${updates.lastName || ""}`.trim();

    await updateFirebaseProfile(firebaseUser, {
      displayName: displayName || firebaseUser.displayName,
      photoURL: updates.profilePhoto || firebaseUser.photoURL,
    });

    const profile = await saveProfile(firebaseUser.uid, {
      email: firebaseUser.email,
      firstName: updates.firstName || "",
      lastName: updates.lastName || "",
      profilePhoto: updates.profilePhoto || null,
    });

    return { success: true, user: formatUser(firebaseUser, profile) };
  } catch (error) {
    return { success: false, error: friendlyAuthError(error) };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: friendlyAuthError(error) };
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.removeItem(PROFILE_KEY);
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: friendlyAuthError(error) };
  }
};
