import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { Cheese } from '../interfaces/cheese';
import { environment } from '../../environments/environment'; // Import environment for API URL
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheeseService {
  private apiUrl = `${environment.apiUrl}/cheeses`;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  constructor() {}

  // Llistar tots els formatges
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


  // Obtenir un formatge per ID
 getCheeseById(id: string): Observable<{ msg: string; cheese: Cheese }> {
  return this.authService.getIdToken$().pipe(
    switchMap((token) => {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get<{ msg: string; cheese: Cheese }>(`${this.apiUrl}/${id}`, { headers });
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
        return this.http.put<Cheese>(`${this.apiUrl}/${id}`, cheese, { headers });
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
}


