import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseStorageService {
  private storage;
  private auth;
  private app;

  constructor() {
    // Initialize Firebase
    this.app = initializeApp(environment.firebase);
    this.storage = getStorage(this.app);
    this.auth = getAuth(this.app);

    // Sign in anonymously to have access to storage
    this.signInAnonymously();
  }

  /**
   * Sign in anonymously to Firebase
   * This allows the app to have access to Firebase Storage
   */
  private async signInAnonymously() {
    try {
      await signInAnonymously(this.auth);
      console.log('Signed in anonymously to Firebase');
    } catch (error) {
      console.error('Error signing in anonymously:', error);
    }
  }

  /**
   * Upload a base64 image to Firebase Storage
   * @param path Path where the image will be stored (e.g., 'cheeses/cheese-id-1.jpeg')
   * @param base64Data Base64 image data without prefix (e.g., without 'data:image/jpeg;base64,')
   * @returns Promise with download URL
   */
  async uploadImage(path: string, base64Data: string): Promise<string> {
    try {
      // Ensure we are signed in
      if (!this.auth.currentUser) {
        await this.signInAnonymously();
      }

      const storageRef = ref(this.storage, path);

      // Upload the base64 data
      await uploadString(storageRef, base64Data, 'base64');

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error: any) {
      console.error('Error uploading image:', error);

      // If the error is permission-related, try signing in again and retrying once
      if (error.code === 'storage/unauthorized') {
        console.log('Trying to re-authenticate and upload again...');
        await this.signInAnonymously();

        // Try upload one more time
        const storageRef = ref(this.storage, path);
        await uploadString(storageRef, base64Data, 'base64');
        return await getDownloadURL(storageRef);
      }

      throw error;
    }
  }

  /**
   * Delete an image from Firebase Storage
   * @param path Path of the image to delete
   */
  async deleteImage(path: string): Promise<void> {
    try {
      // Ensure we are signed in
      if (!this.auth.currentUser) {
        await this.signInAnonymously();
      }

      const storageRef = ref(this.storage, path);
      await deleteObject(storageRef);
    } catch (error: any) {
      console.error('Error deleting image:', error);

      // If the error is permission-related, try signing in again and retrying once
      if (error.code === 'storage/unauthorized') {
        console.log('Trying to re-authenticate and delete again...');
        await this.signInAnonymously();

        // Try delete one more time
        const storageRef = ref(this.storage, path);
        await deleteObject(storageRef);
      } else {
        throw error;
      }
    }
  }

  /**
   * Get the download URL for an image
   * @param path Path of the image
   * @returns Promise with download URL
   */
  async getImageUrl(path: string): Promise<string> {
    try {
      // Ensure we are signed in
      if (!this.auth.currentUser) {
        await this.signInAnonymously();
      }

      const storageRef = ref(this.storage, path);
      return await getDownloadURL(storageRef);
    } catch (error: any) {
      console.error('Error getting image URL:', error);

      // If the error is permission-related, try signing in again and retrying once
      if (error.code === 'storage/unauthorized') {
        console.log('Trying to re-authenticate and get URL again...');
        await this.signInAnonymously();

        // Try get URL one more time
        const storageRef = ref(this.storage, path);
        return await getDownloadURL(storageRef);
      }

      throw error;
    }
  }

  /**
   * List all images in a folder
   * @param folderPath Path to the folder (e.g., 'cheeses/cheese-id')
   * @returns Array of file references
   */
  async listImagesInFolder(folderPath: string) {
    try {
      // Ensure we are signed in
      if (!this.auth.currentUser) {
        await this.signInAnonymously();
      }

      const folderRef = ref(this.storage, folderPath);
      const result = await listAll(folderRef);
      return result.items;
    } catch (error: any) {
      console.error('Error listing images in folder:', error);

      // If the error is permission-related, try signing in again and retrying once
      if (error.code === 'storage/unauthorized') {
        console.log('Trying to re-authenticate and list images again...');
        await this.signInAnonymously();

        // Try list images one more time
        const folderRef = ref(this.storage, folderPath);
        const result = await listAll(folderRef);
        return result.items;
      }

      // If it's a "not found" error, just return an empty array
      if (error.code === 'storage/object-not-found') {
        return [];
      }

      throw error;
    }
  }
}
