import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, tick } from '@angular/core/testing';

import { ProductService, LoginRequest, LoginResponse } from './product-service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login method', () => {
    it('should return success response for valid credentials', fakeAsync(() => {
      const validCredentials: LoginRequest = {
        username: 'admin',
        password: '123456'
      };

      let result: LoginResponse | undefined;

      service.login(validCredentials).subscribe(response => {
        result = response;
      });

      tick(1000); // Simulate delay

      expect(result).toBeDefined();
      expect(result?.success).toBeTruthy();
      expect(result?.token).toBe('fake-jwt-token');
      expect(result?.message).toBe('Login realizado com sucesso!');
      expect(result?.user).toEqual({
        id: 1,
        username: 'admin',
        email: 'admin@example.com'
      });
    }));

    it('should return error response for invalid username', fakeAsync(() => {
      const invalidCredentials: LoginRequest = {
        username: 'wronguser',
        password: '123456'
      };

      let result: LoginResponse | undefined;

      service.login(invalidCredentials).subscribe(response => {
        result = response;
      });

      tick(1000); // Simulate delay

      expect(result).toBeDefined();
      expect(result?.success).toBeFalsy();
      expect(result?.token).toBeUndefined();
      expect(result?.message).toBe('Credenciais inválidas');
      expect(result?.user).toBeUndefined();
    }));

    it('should return error response for invalid password', fakeAsync(() => {
      const invalidCredentials: LoginRequest = {
        username: 'admin',
        password: 'wrongpassword'
      };

      let result: LoginResponse | undefined;

      service.login(invalidCredentials).subscribe(response => {
        result = response;
      });

      tick(1000); // Simulate delay

      expect(result).toBeDefined();
      expect(result?.success).toBeFalsy();
      expect(result?.token).toBeUndefined();
      expect(result?.message).toBe('Credenciais inválidas');
      expect(result?.user).toBeUndefined();
    }));

    it('should return error response for empty credentials', fakeAsync(() => {
      const emptyCredentials: LoginRequest = {
        username: '',
        password: ''
      };

      let result: LoginResponse | undefined;

      service.login(emptyCredentials).subscribe(response => {
        result = response;
      });

      tick(1000); // Simulate delay

      expect(result).toBeDefined();
      expect(result?.success).toBeFalsy();
      expect(result?.message).toBe('Credenciais inválidas');
    }));

    it('should simulate network delay', fakeAsync(() => {
      const credentials: LoginRequest = {
        username: 'admin',
        password: '123456'
      };

      let result: LoginResponse | undefined;
      let completed = false;

      service.login(credentials).subscribe(response => {
        result = response;
        completed = true;
      });

      // Should not complete immediately
      expect(completed).toBeFalsy();
      expect(result).toBeUndefined();

      // Should complete after delay
      tick(1000);
      expect(completed).toBeTruthy();
      expect(result).toBeDefined();
    }));

    it('should return observable', () => {
      const credentials: LoginRequest = {
        username: 'admin',
        password: '123456'
      };

      const result = service.login(credentials);
      expect(result.subscribe).toBeDefined();
    });
  });

  describe('service configuration', () => {
    it('should have correct API URL', () => {
      expect(service['apiUrl']).toBe('http://localhost:3000/api');
    });
  });
});
