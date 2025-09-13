import {
  Injectable,
  Injector,
  inject,
  runInInjectionContext,
} from '@angular/core';
import {
  Storage,
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
  listAll,
} from '@angular/fire/storage';
import { Auth, user } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseStorageService {
  private injector: Injector = inject(Injector);
  private auth = inject(Auth);
  private storage = inject(Storage);

  /**
   * Check if user is authenticated
   */
  private async getCurrentUser() {
    return runInInjectionContext(this.injector, async () => {
      try {
        const currentUser = await firstValueFrom(user(this.auth));
        return currentUser;
      } catch (error) {
        console.error('Error getting current user:', error);
        return null;
      }
    });
  }

  /**
   * Upload a base64 image to Firebase Storage
   * @param path Path where the image will be stored (e.g., 'cheeses/cheese-id-1.jpeg')
   * @param base64Data Base64 image data without prefix (e.g., without 'data:image/jpeg;base64,')
   * @returns Promise with download URL
   */
  async uploadImage(path: string, base64Data: string): Promise<string> {
    try {
      // Ensure the user is logged in
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('User must be logged in to upload images');
      }

      return await runInInjectionContext(this.injector, async () => {
        const storageRef = ref(this.storage, path);

        // Upload the base64 data
        await uploadString(storageRef, base64Data, 'base64');

        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);

      if (error.code === 'storage/unauthorized') {
        throw new Error(
          'User not authorized to upload images. Please check you are logged in.'
        );
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
      // Ensure the user is logged in
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('User must be logged in to delete images');
      }

      await runInInjectionContext(this.injector, async () => {
        const storageRef = ref(this.storage, path);
        await deleteObject(storageRef);
      });
    } catch (error: any) {
      console.error('Error deleting image:', error);

      if (error.code === 'storage/unauthorized') {
        throw new Error(
          'User not authorized to delete images. Please check you are logged in.'
        );
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
      // Ensure the user is logged in
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('User must be logged in to get image URLs');
      }

      return await runInInjectionContext(this.injector, async () => {
        const storageRef = ref(this.storage, path);
        return await getDownloadURL(storageRef);
      });
    } catch (error: any) {
      console.error('Error getting image URL:', error);

      if (error.code === 'storage/unauthorized') {
        throw new Error(
          'User not authorized to access this image. Please check you are logged in.'
        );
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
      // Ensure the user is logged in
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('User must be logged in to list images');
      }

      return await runInInjectionContext(this.injector, async () => {
        const folderRef = ref(this.storage, folderPath);
        const result = await listAll(folderRef);
        return result.items;
      });
    } catch (error: any) {
      console.error('Error listing images in folder:', error);

      // If it's a "not found" error, just return an empty array
      if (error.code === 'storage/object-not-found') {
        return [];
      }

      if (error.code === 'storage/unauthorized') {
        throw new Error(
          'User not authorized to list images. Please check you are logged in.'
        );
      }

      throw error;
    }
  }
}
