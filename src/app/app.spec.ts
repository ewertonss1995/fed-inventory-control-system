// filepath: c:\Users\ewertonss\Documents\workspace\estudos\Sistema-de-controle-de-estoque\fed-inventory-control-system\src\app\app.spec.ts
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
