import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Importações do Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

/**
 * Interface para as credenciais salvas no localStorage
 */
interface SavedCredentials {
  login: string;
  password: string;
}

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
    CommonModule,
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
export class HomeComponent implements OnInit {

  /** Formulário reativo para os dados de login */
  loginForm!: FormGroup;

  /** Controla a visibilidade da senha */
  hidePassword: boolean = true;

  /** Indica se o formulário está sendo processado */
  isLoading: boolean = false;

  /** Chave para armazenar credenciais no localStorage */
  private readonly STORAGE_KEY = 'inventoryLoginCredentials';

  /** Indica se existem credenciais salvas */
  hasSavedCredentials: boolean = false;

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
    console.log('HomeComponent construído!');
    this.initializeForm();
  }

  /**
   * Método executado após a inicialização do componente
   */
  ngOnInit(): void {
    console.log('HomeComponent inicializado!');
    console.log('FormGroup criado:', this.loginForm);
    this.loadSavedCredentials();
  }

  /**
   * Validador customizado que aceita tanto email quanto nome de usuário
   *
   * @param control - O controle do formulário a ser validado
   * @returns null se válido, objeto com erro se inválido
   */
  private emailOrUsernameValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Deixa a validação 'required' cuidar dos campos vazios
    }

    const value = control.value.trim();

    // Primeiro verifica se é um email válido (tem @ e formato correto)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(value);

    // Se contém @ mas não é um email válido, é erro de email
    if (value.includes('@') && !isValidEmail) {
      return { invalidEmail: true };
    }

    // Se é um email válido, aceita
    if (isValidEmail) {
      return null;
    }

    // Se não contém @, trata como nome de usuário
    // Aceita apenas letras, números, pontos, hífens e sublinhados
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!usernameRegex.test(value)) {
      return { invalidUsername: true };
    }

    return null; // Válido
  }

  /**
   * Inicializa o formulário de login com validações
   *
   * Define os campos obrigatórios e suas respectivas validações:
   * - Login: obrigatório, aceita email ou nome de usuário (mínimo 3 caracteres)
   * - Senha: obrigatória, mínimo 6 caracteres
   * - Lembrar: campo opcional (checkbox)
   */
  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      login: ['', [
        Validators.required,
        Validators.minLength(3),
        this.emailOrUsernameValidator
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
    console.log('onSubmit foi chamado!');
    console.log('FormGroup válido?', this.loginForm.valid);
    console.log('Valor do formulário:', this.loginForm.value);
    console.log('Status do formulário:', this.loginForm.status);
    console.log('Erros do formulário:', this.loginForm.errors);

    // Verifica se o formulário é válido
    if (this.loginForm.valid) {
      this.isLoading = true;
      console.log('Formulário é válido! Processando login...');

      // Obtém os valores do formulário
      const loginData = this.loginForm.value;

      console.log('Dados de login:', loginData);

      // Simula uma requisição de login (substituir por serviço real)
      setTimeout(() => {
        this.isLoading = false;
        console.log('Login processado com sucesso!');

        // Gerencia as credenciais baseado no checkbox "Lembrar-me"
        this.handleRememberMe(loginData);

        // Aqui seria implementada a lógica de autenticação real
        // Por enquanto, apenas simula um login bem-sucedido
        alert('Login realizado com sucesso!');

        // Redireciona para o dashboard (substituir pela rota correta)
        // this.router.navigate(['/dashboard']);
      }, 2000);

    } else {
      console.log('Formulário inválido! Marcando campos como touched...');
      console.log('Erros por campo:');
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control && control.errors) {
          console.log(`Campo ${key}:`, control.errors);
        }
      });

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

    if (loginControl?.hasError('minlength')) {
      return 'Digite pelo menos 3 caracteres';
    }

    if (loginControl?.hasError('invalidEmail')) {
      return 'Digite um email válido (exemplo: usuario@email.com)';
    }

    if (loginControl?.hasError('invalidUsername')) {
      return 'Nome de usuário deve conter apenas letras, números, pontos, hífens ou sublinhados';
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

  /**
   * Carrega as credenciais salvas do localStorage
   *
   * Se existirem credenciais salvas e válidas, preenche automaticamente
   * o formulário e marca o checkbox "Lembrar-me" como verdadeiro
   */
  private loadSavedCredentials(): void {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);

      if (savedData) {
        const credentials: SavedCredentials = JSON.parse(savedData);

        // Verifica se as credenciais têm a estrutura esperada
        if (credentials && credentials.login && credentials.password) {
          console.log('Credenciais encontradas, preenchendo formulário...');

          // Preenche o formulário com as credenciais salvas
          this.loginForm.patchValue({
            login: credentials.login,
            password: credentials.password,
            rememberMe: true
          });

          this.hasSavedCredentials = true;
          console.log('Formulário preenchido com credenciais salvas');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar credenciais salvas:', error);
      // Remove dados corrompidos
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  /**
   * Gerencia o salvamento/remoção de credenciais baseado no checkbox
   *
   * @param loginData - Dados do formulário de login
   */
  private handleRememberMe(loginData: any): void {
    if (loginData.rememberMe) {
      this.saveCredentials(loginData.login, loginData.password);
    } else {
      this.clearSavedCredentials();
    }
  }

  /**
   * Salva as credenciais no localStorage
   *
   * @param login - Email ou nome de usuário
   * @param password - Senha do usuário
   */
  private saveCredentials(login: string, password: string): void {
    try {
      const credentials: SavedCredentials = {
        login: login,
        password: password
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(credentials));
      this.hasSavedCredentials = true;
      console.log('Credenciais salvas com sucesso');
    } catch (error) {
      console.error('Erro ao salvar credenciais:', error);
    }
  }

  /**
   * Remove as credenciais salvas do localStorage
   */
  private clearSavedCredentials(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      this.hasSavedCredentials = false;
      console.log('Credenciais removidas com sucesso');
    } catch (error) {
      console.error('Erro ao remover credenciais:', error);
    }
  }

  /**
   * Verifica se existem credenciais salvas
   *
   * @returns true se existem credenciais válidas salvas
   */
  private checkSavedCredentials(): boolean {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (savedData) {
        const credentials: SavedCredentials = JSON.parse(savedData);
        return !!(credentials && credentials.login && credentials.password);
      }
    } catch (error) {
      console.error('Erro ao verificar credenciais salvas:', error);
      localStorage.removeItem(this.STORAGE_KEY);
    }
    return false;
  }
}
