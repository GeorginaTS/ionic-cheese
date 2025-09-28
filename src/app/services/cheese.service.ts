import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap, map, catchError, of, from } from 'rxjs';
import { Cheese } from '../interfaces/cheese';
import { environment } from '../../environments/environment'; // Import environment for API URL
import { AuthService } from './auth.service';
import { FirebaseStorageService } from './firebase-storage.service';

@Injectable({
  providedIn: 'root',
})
export class CheeseService {
  private apiUrl = `${environment.apiUrl}/cheeses`;
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private firebaseStorage = inject(FirebaseStorageService);

  constructor() {}

  getAllPublicCheeses(): Observable<{ msg: string; cheeses: Cheese[] }> {
    console.log(`fetching .... ${this.apiUrl}/public`);
    return this.http.get<{ msg: string; cheeses: Cheese[] }>(
      `${this.apiUrl}/public`
    );
  }
  getPublicCheeseById(id: string): Observable<{ msg: string; cheese: Cheese }> {
    console.log('Fetching public cheese with ID:', id);
    return this.http.get<{ msg: string; cheese: Cheese }>(
      `${this.apiUrl}/public/${id}`
    );
  }

  // Llistar tots els formatges del usuari
  getAllCheeses(): Observable<Cheese[]> {
    return this.authService.getIdToken$().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.get<Cheese[]>(this.apiUrl, { headers });
      })
    );
  }

  // Obtenir un formatge per ID del usuari
  getCheeseById(id: string): Observable<{ msg: string; cheese: Cheese }> {
    return this.authService.getIdToken$().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.get<{ msg: string; cheese: Cheese }>(
          `${this.apiUrl}/${id}`,
          { headers }
        );
      })
    );
  }

  // Crear un formatge nou
  createCheese(cheese: Cheese): Observable<Cheese> {
    return this.authService.getIdToken$().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.post<Cheese>(this.apiUrl, cheese, { headers });
      })
    );
  }

  // Actualitzar un formatge existent
  updateCheese(id: string, cheese: Partial<Cheese>): Observable<Cheese> {
    return this.authService.getIdToken$().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.put<Cheese>(`${this.apiUrl}/${id}`, cheese, {
          headers,
        });
      })
    );
  }

  // Eliminar un formatge
  deleteCheese(id: string): Observable<void> {
    return this.authService.getIdToken$().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
      })
    );
  }

  // Obtenir el nombre de formatges d'un usuari
  getUserCheesesCount(userId: string): Observable<number> {
    return this.getAllCheeses().pipe(
      map(
        (cheeses) => cheeses.filter((cheese) => cheese.userId === userId).length
      ),
      catchError((error) => {
        console.error('Error getting user cheeses count:', error);
        return of(0); // Retornar 0 en cas d'error
      })
    );
  }

  // Obtenir la URL de la imatge principal d'un formatge
  getCheeseMainImage(cheeseId: string): Observable<string | null> {
    return from(this.loadCheeseMainImage(cheeseId));
  }

  private async loadCheeseMainImage(cheeseId: string): Promise<string | null> {
    try {
      const folderPath = `cheeses/${cheeseId}`;
      const items = await this.firebaseStorage.listImagesInFolder(folderPath);

      if (items.length === 0) {
        return null;
      }

      // Ordenar per nom per obtenir la primera imatge (assumint format {cheeseId}-1.jpeg, etc.)
      const sortedItems = items.sort((a, b) => {
        const numA = this.extractPhotoNumber(a.name, cheeseId);
        const numB = this.extractPhotoNumber(b.name, cheeseId);
        return numA - numB;
      });

      // Retornar la URL de la primera imatge
      return await this.firebaseStorage.getImageUrl(sortedItems[0].fullPath);
    } catch (error) {
      console.error('Error loading main image for cheese:', cheeseId, error);
      return null;
    }
  }

  private extractPhotoNumber(fileName: string, cheeseId: string): number {
    const expectedPrefix = `${cheeseId}-`;
    if (!fileName.startsWith(expectedPrefix)) {
      return 0;
    }
    const remainder = fileName.substring(expectedPrefix.length);
    const numberPart = remainder.split('.')[0];
    const number = parseInt(numberPart);
    return isNaN(number) ? 0 : number;
  }
}
