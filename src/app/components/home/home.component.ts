import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Importações do Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

/**
 * Componente Home responsável pela tela de login do sistema
 * 
 * Este componente apresenta um formulário de autenticação com:
 * - Campo de login (email ou nome de usuário)
 * - Campo de senha
 * - Opção "Lembrar-me"
 * - Links para recuperação de senha e cadastro de novo usuário
 * 
 * @author Sistema de Controle de Estoque
 * @version 1.0.0
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  
  /** Formulário reativo para os dados de login */
  loginForm!: FormGroup;
  
  /** Controla a visibilidade da senha */
  hidePassword: boolean = true;
  
  /** Indica se o formulário está sendo processado */
  isLoading: boolean = false;

  /**
   * Construtor do componente
   * 
   * @param formBuilder - Serviço para construção de formulários reativos
   * @param router - Serviço de roteamento do Angular
   */
  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.initializeForm();
  }

  /**
   * Inicializa o formulário de login com validações
   * 
   * Define os campos obrigatórios e suas respectivas validações:
   * - Login: obrigatório, email válido
   * - Senha: obrigatória, mínimo 6 caracteres
   * - Lembrar: campo opcional (checkbox)
   */
  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      login: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      rememberMe: [false]
    });
  }

  /**
   * Alterna a visibilidade da senha
   * 
   * Permite ao usuário mostrar ou ocultar a senha digitada
   * para facilitar a verificação durante a digitação
   */
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  /**
   * Processa o envio do formulário de login
   * 
   * Valida o formulário e, se válido, simula o processo de autenticação.
   * Em uma implementação real, aqui seria feita a chamada para o serviço
   * de autenticação do backend.
   */
  onSubmit(): void {
    // Verifica se o formulário é válido
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      // Obtém os valores do formulário
      const loginData = this.loginForm.value;
      
      console.log('Dados de login:', loginData);
      
      // Simula uma requisição de login (substituir por serviço real)
      setTimeout(() => {
        this.isLoading = false;
        
        // Aqui seria implementada a lógica de autenticação real
        // Por enquanto, apenas simula um login bem-sucedido
        alert('Login realizado com sucesso!');
        
        // Redireciona para o dashboard (substituir pela rota correta)
        // this.router.navigate(['/dashboard']);
      }, 2000);
      
    } else {
      // Marca todos os campos como "touched" para exibir as mensagens de erro
      this.markFormGroupTouched();
    }
  }

  /**
   * Marca todos os campos do formulário como "touched"
   * 
   * Isso força a exibição das mensagens de validação
   * para todos os campos inválidos
   */
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  /**
   * Navega para a tela de recuperação de senha
   * 
   * Redireciona o usuário para a página onde pode solicitar
   * o reset da senha através do email cadastrado
   */
  onForgotPassword(): void {
    console.log('Navegando para recuperação de senha');
    // Implementar navegação para tela de recuperação de senha
    // this.router.navigate(['/forgot-password']);
    alert('Funcionalidade de recuperação de senha será implementada em breve!');
  }

  /**
   * Navega para a tela de cadastro de novo usuário
   * 
   * Redireciona o usuário para a página de registro
   * onde pode criar uma nova conta no sistema
   */
  onRegister(): void {
    console.log('Navegando para cadastro');
    // Implementar navegação para tela de cadastro
    // this.router.navigate(['/register']);
    alert('Funcionalidade de cadastro será implementada em breve!');
  }

  /**
   * Obtém a mensagem de erro para o campo de login
   * 
   * @returns String com a mensagem de erro apropriada
   */
  getLoginErrorMessage(): string {
    const loginControl = this.loginForm.get('login');
    
    if (loginControl?.hasError('required')) {
      return 'O campo login é obrigatório';
    }
    
    if (loginControl?.hasError('email')) {
      return 'Digite um email válido';
    }
    
    return '';
  }

  /**
   * Obtém a mensagem de erro para o campo de senha
   * 
   * @returns String com a mensagem de erro apropriada
   */
  getPasswordErrorMessage(): string {
    const passwordControl = this.loginForm.get('password');
    
    if (passwordControl?.hasError('required')) {
      return 'A senha é obrigatória';
    }
    
    if (passwordControl?.hasError('minlength')) {
      return 'A senha deve ter pelo menos 6 caracteres';
    }
    
    return '';
  }
}