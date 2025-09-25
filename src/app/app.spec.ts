import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { App } from './app';

// Mock component para testes
@Component({
  template: '<div>Test Component</div>',
  standalone: true
})
class MockComponent { }

describe('App', () => {
  let routerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const router = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    routerSpy = jest.spyOn(router, 'navigate');
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have router-outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should have correct title', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.title).toBe('fed-inventory-control-system');
  });
});
