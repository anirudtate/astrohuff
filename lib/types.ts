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
