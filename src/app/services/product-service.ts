import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api'; // URL base do backend

  constructor(private http: HttpClient) { }

  // Método para realizar login
  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Simulação de chamada para o backend
    // Em produção, substituir por: return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials);
    
    // Simulação para desenvolvimento/teste
    return of({
      success: credentials.username === 'admin' && credentials.password === '123456',
      token: credentials.username === 'admin' && credentials.password === '123456' ? 'fake-jwt-token' : undefined,
      message: credentials.username === 'admin' && credentials.password === '123456' 
        ? 'Login realizado com sucesso!' 
        : 'Credenciais inválidas',
      user: credentials.username === 'admin' && credentials.password === '123456' 
        ? { id: 1, username: 'admin', email: 'admin@example.com' } 
        : undefined
    }).pipe(delay(1000)); // Simula delay da rede
  }

  // Método para realizar chamada real ao backend (comentado para referência)
  /*
  loginReal(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials);
  }
  */
}
