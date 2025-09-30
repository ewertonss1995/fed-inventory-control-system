import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsProductModal } from './actions-product-modal';

describe('ActionsProductModal', () => {
  let component: ActionsProductModal;
  let fixture: ComponentFixture<ActionsProductModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsProductModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionsProductModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
