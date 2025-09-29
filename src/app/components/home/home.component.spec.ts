import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Limpa o localStorage antes de cada teste
    localStorage.clear();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário corretamente', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('login')).toBeDefined();
    expect(component.loginForm.get('password')).toBeDefined();
    expect(component.loginForm.get('rememberMe')).toBeDefined();
  });

  it('deve validar login como email válido', () => {
    const loginControl = component.loginForm.get('login');
    loginControl?.setValue('usuario@email.com');
    expect(loginControl?.valid).toBeTrue();
  });

  it('deve validar login como nome de usuário válido', () => {
    const loginControl = component.loginForm.get('login');
    loginControl?.setValue('usuario123');
    expect(loginControl?.valid).toBeTrue();
  });

  it('deve marcar campos como touched se formulário inválido', () => {
    spyOn(component as any, 'markFormGroupTouched').and.callThrough();
    component.loginForm.get('login')?.setValue('');
    component.loginForm.get('password')?.setValue('');
    component.onSubmit();
    expect((component as any).markFormGroupTouched).toHaveBeenCalled();
    expect(component.loginForm.get('login')?.touched).toBeTrue();
    expect(component.loginForm.get('password')?.touched).toBeTrue();
  });

  it('deve alternar visibilidade da senha', () => {
    const initial = component.hidePassword;
    component.togglePasswordVisibility();
    expect(component.hidePassword).toBe(!initial);
  });

  it('deve salvar credenciais no localStorage quando lembrar-me está marcado', (done) => {
    component.loginForm.setValue({
      login: 'usuario@email.com',
      password: '123456',
      rememberMe: true
    });
    component.onSubmit();
    setTimeout(() => {
      const saved = localStorage.getItem('inventoryLoginCredentials');
      expect(saved).toBeTruthy();
      done();
    }, 2100);
  });

  it('deve remover credenciais do localStorage quando lembrar-me não está marcado', (done) => {
    // Primeiro salva credenciais
    component.loginForm.setValue({
      login: 'usuario@email.com',
      password: '123456',
      rememberMe: true
    });
    component.onSubmit();
    setTimeout(() => {
      // Agora desmarca lembrar-me e submete novamente
      component.loginForm.setValue({
        login: 'usuario@email.com',
        password: '123456',
        rememberMe: false
      });
      component.onSubmit();
      setTimeout(() => {
        const saved = localStorage.getItem('inventoryLoginCredentials');
        expect(saved).toBeNull();
        done();
      }, 2100);
    }, 2100);
  });

  it('deve preencher o formulário com credenciais salvas', () => {
    localStorage.setItem('inventoryLoginCredentials', JSON.stringify({
      login: 'usuario@email.com',
      password: '123456'
    }));
    component.ngOnInit();
    expect(component.loginForm.get('login')?.value).toBe('usuario@email.com');
    expect(component.loginForm.get('password')?.value).toBe('123456');
    expect(component.loginForm.get('rememberMe')?.value).toBeTrue();
  });

  it('deve retornar mensagem de erro correta para login', () => {
    const loginControl = component.loginForm.get('login');
    loginControl?.setValue('');
    loginControl?.markAsTouched();
    expect(component.getLoginErrorMessage()).toBe('O campo login é obrigatório');
    loginControl?.setValue('a');
    loginControl?.markAsTouched();
    expect(component.getLoginErrorMessage()).toBe('Digite pelo menos 3 caracteres');
    loginControl?.setValue('usuario@');
    loginControl?.markAsTouched();
    expect(component.getLoginErrorMessage()).toBe('Digite um email válido (exemplo: usuario@email.com)');
    loginControl?.setValue('usuário*');
    loginControl?.markAsTouched();
    expect(component.getLoginErrorMessage()).toBe('Nome de usuário deve conter apenas letras, números, pontos, hífens ou sublinhados');
  });

  it('deve retornar mensagem de erro correta para senha', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('');
    passwordControl?.markAsTouched();
    expect(component.getPasswordErrorMessage()).toBe('A senha é obrigatória');
    passwordControl?.setValue('123');
    passwordControl?.markAsTouched();
    expect(component.getPasswordErrorMessage()).toBe('A senha deve ter pelo menos 6 caracteres');
  });

  it('deve chamar alert ao recuperar senha', () => {
    spyOn(window, 'alert');
    component.onForgotPassword();
    expect(window.alert).toHaveBeenCalledWith('Funcionalidade de recuperação de senha será implementada em breve!');
  });

  it('deve chamar alert ao cadastrar novo usuário', () => {
    spyOn(window, 'alert');
    component.onRegister();
    expect(window.alert).toHaveBeenCalledWith('Funcionalidade de cadastro será implementada em breve!');
  });
});
