import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WorldCheese } from '../interfaces/world-cheese';

@Injectable({
  providedIn: 'root'
})
export class WorldCheesesService {

  private apiUrl = `${environment.apiUrl}/world-cheeses`;

  constructor(private http: HttpClient) {}

  // Llistar tots els formatges
  getAllCheeses(): Observable<WorldCheese[]> {
    return this.http.get<WorldCheese[]>(this.apiUrl);
  }

  // Obtenir un formatge per ID
 getCheeseById(id: string): Observable<{ msg: string; cheese: WorldCheese }> {
  return this.http.get<{ msg: string; cheese: WorldCheese }>(`${this.apiUrl}/${id}`);
}
}
