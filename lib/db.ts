import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export interface UserProfile {
  id: string;
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  gender: "male" | "female" | "other";
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function createUserProfile(
  userId: string,
  data: Partial<UserProfile>
): Promise<void> {
  try {
    const now = new Date().toISOString();
    const profile: UserProfile = {
      id: userId,
      name: "",
      birthDate: "",
      birthTime: "",
      birthPlace: "",
      gender: "male",
      onboardingCompleted: false,
      createdAt: now,
      updatedAt: now,
      ...data,
    };

    await setDoc(doc(db, "users", userId), profile);
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
}

export async function updateUserProfile(
  userId: string,
  data: Partial<UserProfile>
): Promise<void> {
  try {
    const updates = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(doc(db, "users", userId), updates);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}
