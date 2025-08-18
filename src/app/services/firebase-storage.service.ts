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
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseStorageService {
  private storage;

  constructor() {
    // Initialize Firebase
    const app = initializeApp(environment.firebase);
    this.storage = getStorage(app);
  }

  /**
   * Upload a base64 image to Firebase Storage
   * @param path Path where the image will be stored (e.g., 'cheeses/cheese-id-1.jpeg')
   * @param base64Data Base64 image data without prefix (e.g., without 'data:image/jpeg;base64,')
   * @returns Promise with download URL
   */
  async uploadImage(path: string, base64Data: string): Promise<string> {
    const storageRef = ref(this.storage, path);

    // Upload the base64 data
    await uploadString(storageRef, base64Data, 'base64');

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }

  /**
   * Delete an image from Firebase Storage
   * @param path Path of the image to delete
   */
  async deleteImage(path: string): Promise<void> {
    const storageRef = ref(this.storage, path);
    await deleteObject(storageRef);
  }

  /**
   * Get the download URL for an image
   * @param path Path of the image
   * @returns Promise with download URL
   */
  async getImageUrl(path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    return await getDownloadURL(storageRef);
  }

  /**
   * List all images in a folder
   * @param folderPath Path to the folder (e.g., 'cheeses/cheese-id')
   * @returns Array of file references
   */
  async listImagesInFolder(folderPath: string) {
    const folderRef = ref(this.storage, folderPath);
    const result = await listAll(folderRef);
    return result.items;
  }
}
