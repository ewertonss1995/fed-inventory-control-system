import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { HomeComponent } from './home.component';
import { ProductService, LoginRequest, LoginResponse } from '../../services/product-service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  const mockSuccessResponse: LoginResponse = {
    success: true,
    token: 'fake-jwt-token',
    message: 'Login realizado com sucesso!',
    user: {
      id: 1,
      username: 'admin',
      email: 'admin@example.com'
    }
  };

  const mockErrorResponse: LoginResponse = {
    success: false,
    message: 'Credenciais inválidas'
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductService', ['login']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent, ReactiveFormsModule],
      providers: [
        { provide: ProductService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with empty values', () => {
      expect(component.loginForm.get('username')?.value).toBe('');
      expect(component.loginForm.get('password')?.value).toBe('');
    });

    it('should initialize form with validators', () => {
      const usernameControl = component.loginForm.get('username');
      const passwordControl = component.loginForm.get('password');

      // Test required validators
      usernameControl?.setValue('');
      passwordControl?.setValue('');
      expect(usernameControl?.hasError('required')).toBeTruthy();
      expect(passwordControl?.hasError('required')).toBeTruthy();

      // Test minlength validators
      usernameControl?.setValue('ab');
      passwordControl?.setValue('12345');
      expect(usernameControl?.hasError('minlength')).toBeTruthy();
      expect(passwordControl?.hasError('minlength')).toBeTruthy();

      // Test valid values
      usernameControl?.setValue('admin');
      passwordControl?.setValue('123456');
      expect(usernameControl?.hasError('required')).toBeFalsy();
      expect(usernameControl?.hasError('minlength')).toBeFalsy();
      expect(passwordControl?.hasError('required')).toBeFalsy();
      expect(passwordControl?.hasError('minlength')).toBeFalsy();
    });
  });

  describe('Form Validation', () => {
    it('should mark form as invalid when fields are empty', () => {
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should mark form as invalid when username is too short', () => {
      component.loginForm.patchValue({
        username: 'ab',
        password: '123456'
      });
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should mark form as invalid when password is too short', () => {
      component.loginForm.patchValue({
        username: 'admin',
        password: '12345'
      });
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should mark form as valid when all fields are correctly filled', () => {
      component.loginForm.patchValue({
        username: 'admin',
        password: '123456'
      });
      expect(component.loginForm.valid).toBeTruthy();
    });
  });

  describe('hasError method', () => {
    it('should return true when field has specific error and is touched', () => {
      const usernameControl = component.loginForm.get('username');
      usernameControl?.setValue('');
      usernameControl?.markAsTouched();

      expect(component.hasError('username', 'required')).toBeTruthy();
    });

    it('should return false when field has no error', () => {
      const usernameControl = component.loginForm.get('username');
      usernameControl?.setValue('admin');
      usernameControl?.markAsTouched();

      expect(component.hasError('username', 'required')).toBeFalsy();
    });

    it('should return false when field has error but is not touched', () => {
      const usernameControl = component.loginForm.get('username');
      usernameControl?.setValue('');
      // Not marking as touched

      expect(component.hasError('username', 'required')).toBeFalsy();
    });
  });

  describe('onSubmit method', () => {
    it('should not submit when form is invalid', () => {
      component.loginForm.patchValue({
        username: '',
        password: ''
      });

      component.onSubmit();

      expect(productServiceSpy.login).not.toHaveBeenCalled();
      expect(component.isLoading).toBeFalsy();
    });

    it('should mark all fields as touched when form is invalid', () => {
      component.loginForm.patchValue({
        username: '',
        password: ''
      });

      component.onSubmit();

      expect(component.loginForm.get('username')?.touched).toBeTruthy();
      expect(component.loginForm.get('password')?.touched).toBeTruthy();
    });

    it('should call login service when form is valid', fakeAsync(() => {
      productServiceSpy.login.and.returnValue(of(mockSuccessResponse));

      component.loginForm.patchValue({
        username: 'admin',
        password: '123456'
      });

      component.onSubmit();

      expect(component.isLoading).toBeTruthy();
      expect(productServiceSpy.login).toHaveBeenCalledWith({
        username: 'admin',
        password: '123456'
      });

      tick(1000); // Simulate delay

      expect(component.isLoading).toBeFalsy();
      expect(component.loginSuccess).toBeTruthy();
      expect(component.loginMessage).toBe('Login realizado com sucesso!');
    }));

    it('should handle successful login response', fakeAsync(() => {
      productServiceSpy.login.and.returnValue(of(mockSuccessResponse));
      spyOn(localStorage, 'setItem');

      component.loginForm.patchValue({
        username: 'admin',
        password: '123456'
      });

      component.onSubmit();
      tick(1000);

      expect(component.loginSuccess).toBeTruthy();
      expect(component.loginMessage).toBe('Login realizado com sucesso!');
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-jwt-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockSuccessResponse.user));
    }));

    it('should handle failed login response', fakeAsync(() => {
      productServiceSpy.login.and.returnValue(of(mockErrorResponse));

      component.loginForm.patchValue({
        username: 'wrong',
        password: 'wrong'
      });

      component.onSubmit();
      tick(1000);

      expect(component.loginSuccess).toBeFalsy();
      expect(component.loginMessage).toBe('Credenciais inválidas');
    }));

    it('should handle login service error', fakeAsync(() => {
      productServiceSpy.login.and.returnValue(throwError(() => new Error('Network error')));

      component.loginForm.patchValue({
        username: 'admin',
        password: '123456'
      });

      component.onSubmit();
      tick(1000);

      expect(component.isLoading).toBeFalsy();
      expect(component.loginSuccess).toBeFalsy();
      expect(component.loginMessage).toBe('Erro ao realizar login. Tente novamente.');
    }));
  });

  describe('resetForm method', () => {
    it('should reset form and clear messages', () => {
      // Set some values
      component.loginForm.patchValue({
        username: 'admin',
        password: '123456'
      });
      component.loginMessage = 'Some message';
      component.loginSuccess = true;

      component.resetForm();

      expect(component.loginForm.get('username')?.value).toBeNull();
      expect(component.loginForm.get('password')?.value).toBeNull();
      expect(component.loginMessage).toBe('');
      expect(component.loginSuccess).toBeFalsy();
    });
  });

  describe('Component Properties', () => {
    it('should initialize with correct default values', () => {
      expect(component.isLoading).toBeFalsy();
      expect(component.loginMessage).toBe('');
      expect(component.loginSuccess).toBeFalsy();
    });

    it('should provide access to form controls through getter', () => {
      expect(component.f['username']).toBeDefined();
      expect(component.f['password']).toBeDefined();
      expect(component.f['username'].value).toBe('');
      expect(component.f['password'].value).toBe('');
    });
  });

  describe('Template Integration', () => {
    it('should display form elements', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;

      expect(compiled.querySelector('form')).toBeTruthy();
      expect(compiled.querySelector('input[formControlName="username"]')).toBeTruthy();
      expect(compiled.querySelector('input[formControlName="password"]')).toBeTruthy();
      expect(compiled.querySelector('button[type="submit"]')).toBeTruthy();
    });

    it('should display error messages when form is invalid and touched', () => {
      component.loginForm.get('username')?.markAsTouched();
      component.loginForm.get('password')?.markAsTouched();
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.error-text')).toBeTruthy();
    });

    it('should display loading state', () => {
      component.isLoading = true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const submitButton = compiled.querySelector('button[type="submit"]');
      expect(submitButton.disabled).toBeTruthy();
      expect(compiled.querySelector('.loading-spinner')).toBeTruthy();
    });

    it('should display success message', () => {
      component.loginMessage = 'Success!';
      component.loginSuccess = true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const messageDiv = compiled.querySelector('.message.success');
      expect(messageDiv).toBeTruthy();
      expect(messageDiv.textContent?.trim()).toBe('Success!');
    });

    it('should display error message', () => {
      component.loginMessage = 'Error!';
      component.loginSuccess = false;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const messageDiv = compiled.querySelector('.message.error');
      expect(messageDiv).toBeTruthy();
      expect(messageDiv.textContent?.trim()).toBe('Error!');
    });
  });
});
