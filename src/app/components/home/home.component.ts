import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService, LoginRequest, LoginResponse } from '../../services/product-service';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  loginForm: FormGroup;
  isLoading = false;
  loginMessage = '';
  loginSuccess = false;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getter para facilitar acesso aos controles do formulário
  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.loginMessage = '';

    const credentials: LoginRequest = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    this.productService.login(credentials).subscribe({
      next: (response: LoginResponse) => {
        this.isLoading = false;
        this.loginSuccess = response.success;
        this.loginMessage = response.message || '';

        if (response.success) {
          console.log('Login successful:', response);
          // Aqui você pode redirecionar o usuário ou armazenar o token
          localStorage.setItem('token', response.token || '');
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.loginSuccess = false;
        this.loginMessage = 'Erro ao realizar login. Tente novamente.';
        console.error('Login error:', error);
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  // Método para limpar o formulário
  resetForm(): void {
    this.loginForm.reset();
    this.loginMessage = '';
    this.loginSuccess = false;
  }

  // Método para verificar se um campo tem erro específico
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }
}
