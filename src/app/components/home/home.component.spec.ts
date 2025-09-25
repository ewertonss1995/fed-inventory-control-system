import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

// Importações do Angular Material para testes
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { HomeComponent } from './home.component';

/**
 * Arquivo de testes unitários para o componente HomeComponent
 * 
 * Este arquivo contém todos os testes necessários para validar:
 * - Criação e inicialização do componente
 * - Validações do formulário de login
 * - Interações do usuário (clicks, inputs, etc.)
 * - Navegação e redirecionamentos
 * - Estados de loading e error
 * 
 * Configurado para usar Jest como framework de testes
 * 
 * @author Sistema de Controle de Estoque
 * @version 1.0.0
 */
describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;
  let routerSpy: jest.SpyInstance;

  /**
   * Configuração inicial dos testes
   * 
   * Este bloco é executado antes de cada teste individual,
   * configurando o ambiente de teste, importando módulos necessários
   * e criando mocks dos serviços utilizados.
   */
  beforeEach(async () => {
    // Mock do Router para testar navegação
    const routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        // Componente standalone
        HomeComponent,
        
        // Módulos necessários para o teste
        ReactiveFormsModule,
        BrowserAnimationsModule,
        
        // Módulos do Angular Material
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule
      ],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    routerSpy = jest.spyOn(router, 'navigate');
    
    fixture.detectChanges();
  });

  /**
   * Teste de criação do componente
   * 
   * Verifica se o componente é criado corretamente
   * e se todas as propriedades iniciais estão definidas.
   */
  describe('Criação do Componente', () => {
    it('deve criar o componente HomeComponent', () => {
      expect(component).toBeTruthy();
    });

    it('deve inicializar o formulário corretamente', () => {
      expect(component.loginForm).toBeDefined();
      expect(component.loginForm.get('login')).toBeTruthy();
      expect(component.loginForm.get('password')).toBeTruthy();
      expect(component.loginForm.get('rememberMe')).toBeTruthy();
    });

    it('deve inicializar as propriedades com valores padrão', () => {
      expect(component.hidePassword).toBe(true);
      expect(component.isLoading).toBe(false);
    });
  });

  /**
   * Testes de validação do formulário
   * 
   * Verifica se as validações dos campos estão funcionando
   * corretamente e se as mensagens de erro são exibidas adequadamente.
   */
  describe('Validações do Formulário', () => {
    it('deve marcar o campo login como inválido quando vazio', () => {
      const loginControl = component.loginForm.get('login');
      
      loginControl?.setValue('');
      loginControl?.markAsTouched();
      
      expect(loginControl?.invalid).toBe(true);
      expect(loginControl?.hasError('required')).toBe(true);
    });

    it('deve marcar o campo login como inválido com email inválido', () => {
      const loginControl = component.loginForm.get('login');
      
      loginControl?.setValue('email-invalido');
      loginControl?.markAsTouched();
      
      expect(loginControl?.invalid).toBe(true);
      expect(loginControl?.hasError('email')).toBe(true);
    });

    it('deve marcar o campo login como válido com email válido', () => {
      const loginControl = component.loginForm.get('login');
      
      loginControl?.setValue('usuario@exemplo.com');
      
      expect(loginControl?.valid).toBe(true);
    });

    it('deve marcar o campo senha como inválido quando vazio', () => {
      const passwordControl = component.loginForm.get('password');
      
      passwordControl?.setValue('');
      passwordControl?.markAsTouched();
      
      expect(passwordControl?.invalid).toBe(true);
      expect(passwordControl?.hasError('required')).toBe(true);
    });

    it('deve marcar o campo senha como inválido com menos de 6 caracteres', () => {
      const passwordControl = component.loginForm.get('password');
      
      passwordControl?.setValue('123');
      passwordControl?.markAsTouched();
      
      expect(passwordControl?.invalid).toBe(true);
      expect(passwordControl?.hasError('minlength')).toBe(true);
    });

    it('deve marcar o campo senha como válido com 6 ou mais caracteres', () => {
      const passwordControl = component.loginForm.get('password');
      
      passwordControl?.setValue('123456');
      
      expect(passwordControl?.valid).toBe(true);
    });

    it('deve marcar o formulário como válido com dados corretos', () => {
      component.loginForm.patchValue({
        login: 'usuario@exemplo.com',
        password: '123456',
        rememberMe: false
      });
      
      expect(component.loginForm.valid).toBe(true);
    });
  });

  /**
   * Testes das mensagens de erro
   * 
   * Verifica se as mensagens de erro corretas são retornadas
   * para diferentes tipos de validação.
   */
  describe('Mensagens de Erro', () => {
    it('deve retornar mensagem de campo obrigatório para login vazio', () => {
      const loginControl = component.loginForm.get('login');
      loginControl?.setValue('');
      loginControl?.markAsTouched();
      
      expect(component.getLoginErrorMessage()).toBe('O campo login é obrigatório');
    });

    it('deve retornar mensagem de email inválido', () => {
      const loginControl = component.loginForm.get('login');
      loginControl?.setValue('email-invalido');
      loginControl?.markAsTouched();
      
      expect(component.getLoginErrorMessage()).toBe('Digite um email válido');
    });

    it('deve retornar mensagem de senha obrigatória', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('');
      passwordControl?.markAsTouched();
      
      expect(component.getPasswordErrorMessage()).toBe('A senha é obrigatória');
    });

    it('deve retornar mensagem de senha muito curta', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('123');
      passwordControl?.markAsTouched();
      
      expect(component.getPasswordErrorMessage()).toBe('A senha deve ter pelo menos 6 caracteres');
    });

    it('deve retornar string vazia para campos válidos', () => {
      component.loginForm.patchValue({
        login: 'usuario@exemplo.com',
        password: '123456'
      });
      
      expect(component.getLoginErrorMessage()).toBe('');
      expect(component.getPasswordErrorMessage()).toBe('');
    });
  });

  /**
   * Testes de interação do usuário
   * 
   * Verifica se as interações do usuário (clicks, toggles, etc.)
   * estão funcionando corretamente.
   */
  describe('Interações do Usuário', () => {
    it('deve alternar a visibilidade da senha', () => {
      const initialState = component.hidePassword;
      
      component.togglePasswordVisibility();
      
      expect(component.hidePassword).toBe(!initialState);
    });

    it('deve alternar a visibilidade da senha múltiplas vezes', () => {
      expect(component.hidePassword).toBe(true);
      
      component.togglePasswordVisibility();
      expect(component.hidePassword).toBe(false);
      
      component.togglePasswordVisibility();
      expect(component.hidePassword).toBe(true);
    });
  });

  /**
   * Testes de submissão do formulário
   * 
   * Verifica o comportamento da submissão do formulário
   * em diferentes cenários (válido, inválido, loading).
   */
  describe('Submissão do Formulário', () => {
    it('não deve submeter formulário inválido', () => {
      component.loginForm.patchValue({
        login: '',
        password: ''
      });
      
      const consoleSpy = jest.spyOn(console, 'log');
      component.onSubmit();
      
      expect(consoleSpy).not.toHaveBeenCalledWith(
        'Dados de login:', 
        expect.any(Object)
      );
    });

    it('deve marcar todos os campos como touched ao tentar submeter formulário inválido', () => {
      component.loginForm.patchValue({
        login: '',
        password: ''
      });
      
      component.onSubmit();
      
      expect(component.loginForm.get('login')?.touched).toBe(true);
      expect(component.loginForm.get('password')?.touched).toBe(true);
    });

    it('deve processar submissão com formulário válido', () => {
      component.loginForm.patchValue({
        login: 'usuario@exemplo.com',
        password: '123456',
        rememberMe: true
      });
      
      const consoleSpy = jest.spyOn(console, 'log');
      component.onSubmit();
      
      expect(component.isLoading).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Dados de login:', 
        {
          login: 'usuario@exemplo.com',
          password: '123456',
          rememberMe: true
        }
      );
    });

    it('deve resetar loading após timeout simulado', (done) => {
      component.loginForm.patchValue({
        login: 'usuario@exemplo.com',
        password: '123456'
      });
      
      // Mock do alert para evitar popup durante testes
      jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      component.onSubmit();
      expect(component.isLoading).toBe(true);
      
      // Verifica se o loading é resetado após 2 segundos
      setTimeout(() => {
        expect(component.isLoading).toBe(false);
        done();
      }, 2100);
    });
  });

  /**
   * Testes de navegação
   * 
   * Verifica se as funções de navegação estão sendo
   * chamadas corretamente (mock do Router).
   */
  describe('Navegação', () => {
    it('deve chamar função de esqueci senha', () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      const consoleSpy = jest.spyOn(console, 'log');
      
      component.onForgotPassword();
      
      expect(consoleSpy).toHaveBeenCalledWith('Navegando para recuperação de senha');
      expect(alertSpy).toHaveBeenCalledWith(
        'Funcionalidade de recuperação de senha será implementada em breve!'
      );
    });

    it('deve chamar função de cadastro', () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      const consoleSpy = jest.spyOn(console, 'log');
      
      component.onRegister();
      
      expect(consoleSpy).toHaveBeenCalledWith('Navegando para cadastro');
      expect(alertSpy).toHaveBeenCalledWith(
        'Funcionalidade de cadastro será implementada em breve!'
      );
    });
  });

  /**
   * Testes de renderização do template
   * 
   * Verifica se os elementos do template estão sendo
   * renderizados corretamente e respondem às interações.
   */
  describe('Renderização do Template', () => {
    it('deve renderizar o título do sistema', () => {
      const titleElement = fixture.debugElement.query(
        By.css('.login-title')
      );
      
      expect(titleElement).toBeTruthy();
      expect(titleElement.nativeElement.textContent).toContain(
        'Sistema de Controle de Estoque'
      );
    });

    it('deve renderizar os campos de input', () => {
      const loginInput = fixture.debugElement.query(
        By.css('input[formControlName="login"]')
      );
      const passwordInput = fixture.debugElement.query(
        By.css('input[formControlName="password"]')
      );
      
      expect(loginInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
    });

    it('deve renderizar o checkbox "Lembrar-me"', () => {
      const rememberCheckbox = fixture.debugElement.query(
        By.css('mat-checkbox[formControlName="rememberMe"]')
      );
      
      expect(rememberCheckbox).toBeTruthy();
    });

    it('deve renderizar os botões de ação', () => {
      const loginButton = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );
      const forgotPasswordButton = fixture.debugElement.query(
        By.css('button')
      );
      
      expect(loginButton).toBeTruthy();
      expect(forgotPasswordButton).toBeTruthy();
    });

    it('deve mostrar mensagens de erro quando campos são inválidos', () => {
      // Torna os campos inválidos e touched
      const loginControl = component.loginForm.get('login');
      const passwordControl = component.loginForm.get('password');
      
      loginControl?.setValue('');
      loginControl?.markAsTouched();
      passwordControl?.setValue('');
      passwordControl?.markAsTouched();
      
      fixture.detectChanges();
      
      const errorMessages = fixture.debugElement.queryAll(
        By.css('mat-error')
      );
      
      expect(errorMessages.length).toBeGreaterThan(0);
    });

    it('deve mostrar/ocultar senha ao clicar no botão de visibilidade', () => {
      const passwordInput = fixture.debugElement.query(
        By.css('input[formControlName="password"]')
      ) as DebugElement;
      const toggleButton = fixture.debugElement.query(
        By.css('button[matSuffix]')
      );
      
      expect(passwordInput.nativeElement.type).toBe('password');
      
      toggleButton.nativeElement.click();
      fixture.detectChanges();
      
      expect(passwordInput.nativeElement.type).toBe('text');
    });
  });

  /**
   * Testes de estado do componente
   * 
   * Verifica se os diferentes estados do componente
   * (loading, erro, sucesso) são gerenciados corretamente.
   */
  describe('Estados do Componente', () => {
    it('deve desabilitar botão durante loading', () => {
      component.isLoading = true;
      fixture.detectChanges();
      
      const loginButton = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );
      
      expect(loginButton.nativeElement.disabled).toBe(true);
    });

    it('deve habilitar botão quando não está em loading', () => {
      component.isLoading = false;
      fixture.detectChanges();
      
      const loginButton = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );
      
      expect(loginButton.nativeElement.disabled).toBe(false);
    });

    it('deve mostrar texto correto no botão baseado no estado loading', () => {
      // Estado normal
      component.isLoading = false;
      fixture.detectChanges();
      
      const loginButton = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );
      
      expect(loginButton.nativeElement.textContent).toContain('Entrar');
      
      // Estado loading
      component.isLoading = true;
      fixture.detectChanges();
      
      expect(loginButton.nativeElement.textContent).toContain('Entrando...');
    });
  });

  /**
   * Limpeza após cada teste
   * 
   * Restaura os mocks e limpa o estado para o próximo teste.
   */
  afterEach(() => {
    jest.restoreAllMocks();
  });
});