import { FieldValue } from "@angular/fire/firestore";

export interface AppUser {
  uid: string;
  displayName?: string;
  email: string;
  photoURL?: string;
  birthDate?: string;
  country?: string;
  province?: string;
  city?: string;
  createdAt?: Date | FieldValue;
  updatedAt?: Date | FieldValue;
}