import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(username: string, role: UserRole): Observable<User> {
    const user: User = {
      id: Math.random().toString(36).substring(2, 9),
      username,
      role
    };
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    
    return of(user);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: UserRole): boolean {
    const user = this.currentUserSubject.value;
    return user !== null && user.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }
}