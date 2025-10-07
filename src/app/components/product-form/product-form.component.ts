import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ProductResponseModel } from '../../shared/model/product/response/product-response-model';
import { ProductRequestModel } from '../../shared/model/product/request/product-request-model';
import { CategoryResponseModel } from '../../shared/model/category/response/category-response-model';
import { CategoryService } from '../../core/services/category/category-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../core/services/product/product-service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit, OnDestroy {
  product?: ProductResponseModel;
  categories: CategoryResponseModel[] = [];
  isEditMode: boolean = false;
  isViewOnly: boolean = false;

  productForm!: FormGroup;
  pageTitle: string = 'Formulário de Produto'
  action!: string;
  isInitialized: boolean = false;
  productId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.action = params['action'];
    });

    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((queryParams) => {
        this.productId = queryParams['productId'] ? Number(queryParams['productId']) : null;
      });

    this.buildPageInfo();
    this.loadCategoriesAndInitialize();
  }

  private buildPageInfo() {
    if (this.productId && this.action == 'edit') {
      this.isEditMode = true;
      this.isViewOnly = false;
      this.pageTitle = 'Editar Produto';
      this.loadProductById(this.productId);
    } else if (this.productId && this.action == 'view') {
      this.isViewOnly = true;
      this.isEditMode = false;
      this.pageTitle = 'Visualizar Produto';
      this.loadProductById(this.productId);
    } else {
      this.isEditMode = false;
      this.pageTitle = 'Novo Produto';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCategoriesAndInitialize() {
    try {
      this.categoryService.getCategoryList()
        .subscribe({
          next: (result) => {
            this.categories = result;
            this.initializeForm();

            setTimeout(() => {
              this.cdr.detectChanges();
            });
          },
          error: (error) => {
            console.error(`Erro ao buscar categorias no banco de dados: ${error}`);
            this.initializeForm();
          }
        });
    } catch (error) {
      console.error(`Erro ao buscar categorias no banco de dados: ${error}`);
      this.initializeForm();
    }
  }

  private loadProductById(productId: number) {
    this.productService.getProductById(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (product: ProductResponseModel) => {
          this.product = product;
          console.log('Produto carregado:', this.product);

          if (this.categories.length > 0) {
            this.initializeForm();
          }
        },
        error: (error) => {
          console.error(`Erro ao carregar produto: ${error}`);
          this.router.navigate(['/home']);
        }
      });
  }

  private initializeForm(): void {
    if ((this.isEditMode || this.isViewOnly)) {
      this.buildFormToViewOrUpdate();
    } else {
      this.productForm = this.formBuilder.group({
        productName: ['', [Validators.required, Validators.minLength(2)]],
        productDescription: ['', [Validators.required, Validators.minLength(5)]],
        unitPrice: [null, [Validators.required, Validators.min(0.01)]],
        quantity: [null, [Validators.required, Validators.min(0)]],
        categoryId: [null, [Validators.required]]
      });
    }

    if (this.isEditMode && !this.isViewOnly) {
      this.productForm.get('unitPrice')?.valueChanges.subscribe(() => this.updateTotalPrice());
      this.productForm.get('quantity')?.valueChanges.subscribe(() => this.updateTotalPrice());
    }

    this.isInitialized = true;
  }

  private buildFormToViewOrUpdate(): void {
    if (this.product) {
      this.productForm = this.formBuilder.group({
        productId: [{ value: this.product.productId, disabled: true }],
        productName: [
          { value: this.product.productName, disabled: this.isViewOnly },
          [Validators.required, Validators.minLength(2)]
        ],
        productDescription: [
          { value: this.product.productDescription, disabled: this.isViewOnly },
          [Validators.required, Validators.minLength(5)]
        ],
        unitPrice: [
          { value: this.product.unitPrice, disabled: this.isViewOnly },
          [Validators.required, Validators.min(0.01)]
        ],
        quantity: [
          { value: this.product.quantity, disabled: this.isViewOnly },
          [Validators.required, Validators.min(0)]
        ],
        totalPrice: [{ value: this.product.totalPrice, disabled: true }],
        categoryId: [
          { value: this.product.category.categoryId, disabled: false }, // Nunca desabilitar aqui, controlamos no template
          [Validators.required]
        ],
        registrationDate: [{ value: new Date(this.product.registrationDate), disabled: true }],
        updateDate: [{ value: new Date(this.product.updateDate), disabled: true }]
      });
    }
  }

  private updateTotalPrice(): void {
    const unitPrice = this.productForm.get('unitPrice')?.value || 0;
    const quantity = this.productForm.get('quantity')?.value || 0;
    const totalPrice = unitPrice * quantity;
    this.productForm.get('totalPrice')?.setValue(totalPrice);
  }

  onSubmit(): void {
    if (!this.isInitialized || !this.productForm) {
      return;
    }

    if (this.isViewOnly) {
      this.navigateBack();
      return;
    }

    if (this.productForm.valid) {
      const formValue = this.productForm.getRawValue();

      const productRequest: ProductRequestModel = {
        productName: formValue.productName,
        productDescription: formValue.productDescription,
        unitPrice: formValue.unitPrice,
        quantity: formValue.quantity,
        categoryId: formValue.categoryId
      };

      this.processFormSubmission(formValue, productRequest);
    } else {
      this.markFormGroupTouched();
    }
  }

  private processFormSubmission(formValue: any, productRequest: ProductRequestModel): void {
    if (this.isEditMode && formValue.productId) {
      this.updateProduct(formValue, productRequest);
    } else {
      this.createNewProduct(productRequest);
    }
  }

  private createNewProduct(productRequest: ProductRequestModel) {
    this.productService.createProduct(productRequest).subscribe({
      next: () => {
        console.log('Produto criado com sucesso');
        setTimeout(() => {
          this.navigateBack();
        });
      },
      error: (error) => {
        console.error(`Erro ao criar produto: ${error}`);
      }
    });
  }

  private updateProduct(formValue: any, productRequest: ProductRequestModel) {
    this.productService.updateProduct(formValue.productId, productRequest).subscribe({
      next: () => {
        console.log('Produto atualizado com sucesso');
        setTimeout(() => {
          this.navigateBack();
        });
      },
      error: (error) => {
        console.error(`Erro ao atualizar produto: ${error}`);
      }
    });
  }

  onCancel(): void {
    this.navigateBack();
  }

  private navigateBack(): void {
    this.router.navigate(['/home']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.productForm.get(fieldName);

    if (control?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} é obrigatório`;
    }

    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `${this.getFieldDisplayName(fieldName)} deve ter pelo menos ${minLength} caracteres`;
    }

    if (control?.hasError('min')) {
      const min = control.errors?.['min'].min;
      return `${this.getFieldDisplayName(fieldName)} deve ser maior que ${min}`;
    }

    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      'productName': 'Nome do Produto',
      'productDescription': 'Descrição',
      'unitPrice': 'Preço Unitário',
      'quantity': 'Quantidade',
      'categoryId': 'Categoria'
    };

    return fieldNames[fieldName] || fieldName;
  }

  getCategoryName(categoryId: number): string {
    if (!categoryId || !this.categories || !Array.isArray(this.categories) || this.categories.length === 0) {
      return '';
    }

    try {
      const category = this.categories.find(cat => cat && cat.categoryId === categoryId);
      return category ? category.categoryName || '' : '';
    } catch (error) {
      console.warn('Erro ao buscar nome da categoria:', error);
      return '';
    }
  }
}
