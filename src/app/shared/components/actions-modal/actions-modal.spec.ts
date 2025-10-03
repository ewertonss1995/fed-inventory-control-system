import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsModal } from './actions-modal';

describe('ActionsProductModal', () => {
  let component: ActionsModal;
  let fixture: ComponentFixture<ActionsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
