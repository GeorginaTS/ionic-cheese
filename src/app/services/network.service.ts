import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NetworkService {
  private connectionStateSubject = new BehaviorSubject<'online' | 'offline'>(
    navigator.onLine ? 'online' : 'offline'
  );
  public connectionState$ = this.connectionStateSubject.asObservable();

  constructor() {
    window.addEventListener('online', () => this.connectionStateSubject.next('online'));
    window.addEventListener('offline', () => this.connectionStateSubject.next('offline'));
  }

  /** Retorna l’estat actual */
  get isOnline(): boolean {
    return this.connectionStateSubject.value === 'online';
  }
}
