import { FieldValue } from "@angular/fire/firestore";

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  birthDate: string;
  country: string;
  province: string;
  city: string;
  createdAt: Date | FieldValue;
}