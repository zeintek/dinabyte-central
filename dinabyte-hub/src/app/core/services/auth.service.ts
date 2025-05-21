import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StorageService } from './storage.service';

const AUTH_API = 'http://localhost:8080/api/auth/';

interface AuthResponse {
  token: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(AUTH_API + 'signin', {
      username,
      password
    }).pipe(
      tap(response => {
        console.log('Login response:', response); // Depuración
        this.saveToken(response.token);
        this.saveUser(response);
      })
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      email,
      password
    });
  }

  logout(): void {
    console.log('Logging out, clearing storage'); // Depuración
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
  }

  saveToken(token: string): void {
    this.storageService.setItem('auth-token', token);
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      const token = this.storageService.getItem('auth-token');
      console.log('Retrieved token:', token); // Depuración
      return token;
    }
    return null;
  }

  removeToken(): void {
    this.storageService.removeItem('auth-token');
  }

  saveUser(user: any): void {
    localStorage.setItem('auth-user', JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem('auth-user');
    if (user) {
      const parsedUser = JSON.parse(user);
      console.log('Retrieved user:', parsedUser); // Depuración
      return parsedUser;
    }
    return null;
  }

  isLoggedIn(): boolean {
    if (typeof localStorage !== 'undefined') {
      const loggedIn = !!this.getToken();
      console.log('isLoggedIn:', loggedIn); // Depuración
      return loggedIn;
    }
    return false;
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    if (user && user.roles) {
      const hasRole = user.roles.includes(role);
      console.log(`hasRole(${role}):`, hasRole); // Depuración
      return hasRole;
    }
    console.log(`hasRole(${role}): false (no user or roles)`); // Depuración
    return false;
  }
}