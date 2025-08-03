// src/app/services/cheese.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cheese } from '../interfaces/cheese';
import { environment } from '../../environments/environment'; // Import environment for API URL

@Injectable({
  providedIn: 'root'
})
export class CheeseService {
  private apiUrl = `${environment.apiUrl}/cheeses`;

  constructor(private http: HttpClient) {}

  // Llistar tots els formatges
  getAllCheeses(): Observable<Cheese[]> {
    return this.http.get<Cheese[]>(this.apiUrl);
  }

  // Obtenir un formatge per ID
 getCheeseById(id: string): Observable<{ msg: string; cheese: Cheese }> {
  return this.http.get<{ msg: string; cheese: Cheese }>(`${this.apiUrl}/${id}`);
}

  // Crear un formatge nou
  createCheese(cheese: Cheese): Observable<Cheese> {
    return this.http.post<Cheese>(this.apiUrl, cheese);
  }

  // Actualitzar un formatge existent
  updateCheese(id: string, cheese: Partial<Cheese>): Observable<Cheese> {
    return this.http.put<Cheese>(`${this.apiUrl}/${id}`, cheese);
  }

  // Eliminar un formatge
  deleteCheese(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

