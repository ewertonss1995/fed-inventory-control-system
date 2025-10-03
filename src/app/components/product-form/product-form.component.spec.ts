import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { ProductFormComponent } from './product-form.component';
import { ProductResponseModel } from '../../shared/model/product/response/product-response-model';
import { CategoryResponseModel } from '../../shared/model/category/response/category-response-model';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;

  const mockCategories: CategoryResponseModel[] = [
    {
      categoryId: 1,
      categoryName: 'Eletrônicos',
      registrationDate: new Date('2023-01-01'),
      updateDate: new Date('2023-01-01')
    },
    {
      categoryId: 2,
      categoryName: 'Roupas',
      registrationDate: new Date('2023-01-02'),
      updateDate: new Date('2023-01-02')
    }
  ];

  const mockProduct: ProductResponseModel = {
    productId: 1,
    productName: 'Smartphone',
    productDescription: 'Smartphone com 128GB de armazenamento',
    unitPrice: 999.99,
    quantity: 10,
    totalPrice: 9999.90,
    category: mockCategories[0],
    registrationDate: '2023-01-01T10:00:00Z',
    updateDate: '2023-01-02T15:30:00Z'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductFormComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form for creation mode', () => {
    component.isEditMode = false;
    component.categories = mockCategories;
    component.ngOnInit();

    expect(component.productForm.get('productName')?.value).toBe('');
    expect(component.productForm.get('productDescription')?.value).toBe('');
    expect(component.productForm.get('unitPrice')?.value).toBeNull();
    expect(component.productForm.get('quantity')?.value).toBeNull();
    expect(component.productForm.get('categoryId')?.value).toBeNull();

    // Campos que não devem existir no modo de criação
    expect(component.productForm.get('productId')).toBeNull();
    expect(component.productForm.get('totalPrice')).toBeNull();
    expect(component.productForm.get('registrationDate')).toBeNull();
    expect(component.productForm.get('updateDate')).toBeNull();
  });

  it('should initialize form for edit mode', () => {
    component.isEditMode = true;
    component.product = mockProduct;
    component.categories = mockCategories;
    component.ngOnInit();

    expect(component.productForm.get('productId')?.value).toBe(1);
    expect(component.productForm.get('productName')?.value).toBe('Smartphone');
    expect(component.productForm.get('productDescription')?.value).toBe('Smartphone com 128GB de armazenamento');
    expect(component.productForm.get('unitPrice')?.value).toBe(999.99);
    expect(component.productForm.get('quantity')?.value).toBe(10);
    expect(component.productForm.get('totalPrice')?.value).toBe(9999.90);
    expect(component.productForm.get('categoryId')?.value).toBe(1);
  });

  it('should validate required fields', () => {
    component.isEditMode = false;
    component.categories = mockCategories;
    component.ngOnInit();

    // Tentar submeter formulário vazio
    component.onSubmit();

    expect(component.productForm.get('productName')?.hasError('required')).toBeTruthy();
    expect(component.productForm.get('productDescription')?.hasError('required')).toBeTruthy();
    expect(component.productForm.get('unitPrice')?.hasError('required')).toBeTruthy();
    expect(component.productForm.get('quantity')?.hasError('required')).toBeTruthy();
    expect(component.productForm.get('categoryId')?.hasError('required')).toBeTruthy();
  });

  it('should emit formSubmit when valid form is submitted', () => {
    spyOn(component.formSubmit, 'emit');

    component.isEditMode = false;
    component.categories = mockCategories;
    component.ngOnInit();

    // Preencher formulário com dados válidos
    component.productForm.patchValue({
      productName: 'Test Product',
      productDescription: 'Test Description',
      unitPrice: 100,
      quantity: 5,
      categoryId: 1
    });

    component.onSubmit();

    expect(component.formSubmit.emit).toHaveBeenCalledWith({
      productName: 'Test Product',
      productDescription: 'Test Description',
      unitPrice: 100,
      quantity: 5,
      categoryId: 1
    });
  });

  it('should emit formCancel when cancel is clicked', () => {
    spyOn(component.formCancel, 'emit');

    component.onCancel();

    expect(component.formCancel.emit).toHaveBeenCalled();
  });

  it('should return correct error messages', () => {
    component.isEditMode = false;
    component.ngOnInit();

    const productNameControl = component.productForm.get('productName');
    productNameControl?.setValue('');
    productNameControl?.markAsTouched();

    expect(component.getErrorMessage('productName')).toBe('Nome do Produto é obrigatório');

    productNameControl?.setValue('A');
    expect(component.getErrorMessage('productName')).toBe('Nome do Produto deve ter pelo menos 2 caracteres');
  });

  it('should update total price in edit mode', () => {
    component.isEditMode = true;
    component.product = mockProduct;
    component.categories = mockCategories;
    component.ngOnInit();

    // Atualizar preço unitário
    component.productForm.get('unitPrice')?.setValue(50);
    // Aguardar a atualização do preço total
    expect(component.productForm.get('totalPrice')?.value).toBe(500); // 50 * 10

    // Atualizar quantidade
    component.productForm.get('quantity')?.setValue(20);
    // Aguardar a atualização do preço total
    expect(component.productForm.get('totalPrice')?.value).toBe(1000); // 50 * 20
  });

  it('should get category name by id', () => {
    component.categories = mockCategories;

    expect(component.getCategoryName(1)).toBe('Eletrônicos');
    expect(component.getCategoryName(2)).toBe('Roupas');
    expect(component.getCategoryName(999)).toBe('');
  });
});
