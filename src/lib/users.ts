export interface UserProfile {
  id: string;
  username: string;
  passkey: string;
  role: string;
}

export const USER_DATABASE: UserProfile[] = [
  { id: "1", username: "User1", passkey: "12345678", role: "ADMIN" },
  { id: "2", username: "User2", passkey: "12345678", role: "USER" },
  { id: "3", username: "User3", passkey: "12345678", role: "USER" },
  { id: "4", username: "User4", passkey: "12345678", role: "USER" },
  { id: "5", username: "User5", passkey: "12345678", role: "USER" },
  { id: "6", username: "User6", passkey: "12345678", role: "USER" },
  { id: "7", username: "User7", passkey: "12345678", role: "USER" },
  { id: "8", username: "User8", passkey: "12345678", role: "USER" },
  { id: "9", username: "User9", passkey: "12345678", role: "USER" },
  { id: "10", username: "User10", passkey: "12345678", role: "USER" },
];
