import { Component, Input, Output, EventEmitter, OnInit, Optional, Inject, ChangeDetectorRef } from '@angular/core';
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
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../core/services/category/category-service';
import { Router } from '@angular/router';
import { ProductService } from '../../core/services/product/product-service';

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
    MatNativeDateModule,
    MatDialogModule
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  @Input() product?: ProductResponseModel;
  @Input() categories: CategoryResponseModel[] = [];
  @Input() isEditMode: boolean = false;
  @Input() isViewOnly: boolean = false;
  @Output() formSubmit = new EventEmitter<ProductRequestModel>();
  @Output() formCancel = new EventEmitter<void>();

  productForm!: FormGroup;
  dialogTitle: string = 'Formulário de Produto';
  isInitialized: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: any,
    @Optional() private dialogRef: MatDialogRef<ProductFormComponent>
  ) {
    // Inicializar formulário vazio para evitar erro NG01052
    this.productForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.setupComponentFromDialogData();

    // Se já temos categorias, inicializar imediatamente
    if (this.categories && this.categories.length > 0) {
      this.initializeForm();
    } else {
      // Caso contrário, carregar categorias primeiro e depois inicializar
      this.loadCategoriesAndInitialize();
    }
  }

  private loadCategoriesAndInitialize() {
    try {
      this.categoryService.getCategoryList()
        .subscribe({
          next: (result) => {
            this.categories = result;
            // Inicializar formulário após carregar categorias
            this.initializeForm();
            // Usar setTimeout para evitar problemas de detecção de mudanças
            setTimeout(() => {
              this.cdr.detectChanges();
            });
          },
          error: (error) => {
            console.error(`Erro ao buscar categorias no banco de dados: ${error}`);
            // Mesmo com erro, inicializar formulário
            this.initializeForm();
          }
        });
    } catch (error) {
      console.error(`Erro ao buscar categorias no banco de dados: ${error}`);
      // Mesmo com erro, inicializar formulário
      this.initializeForm();
    }
  }

  private setupComponentFromDialogData(): void {
    if (this.dialogData) {
      this.product = this.dialogData.product;
      this.categories = this.dialogData.categories || this.categories || [];
      this.isEditMode = this.dialogData.isEditMode || false;
      this.isViewOnly = this.dialogData.isViewOnly || false;
      this.dialogTitle = this.dialogData.title || 'Formulário de Produto';
    }
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

    // Atualizar o preço total quando unitPrice ou quantidade mudarem
    if (this.isEditMode && !this.isViewOnly) {
      this.productForm.get('unitPrice')?.valueChanges.subscribe(() => this.updateTotalPrice());
      this.productForm.get('quantity')?.valueChanges.subscribe(() => this.updateTotalPrice());
    }

    // Marcar como inicializado
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
      this.closeDialog();
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

      if (this.dialogRef) {
        this.processFormSubmission(formValue, productRequest);
        this.dialogRef.close(productRequest);
      } else {
        // Se não estamos em dialog, processar diretamente
        this.processFormSubmission(formValue, productRequest);
      }
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
          this.closeDialog();
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
          this.closeDialog();
        });
      },
      error: (error) => {
        console.error(`Erro ao atualizar produto: ${error}`);
      }
    });
  }

  onCancel(): void {
    this.closeDialog();
  }

  private closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.formCancel.emit();
      this.router.navigate(['/home']);
    }
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
    // Retorno seguro durante inicialização
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
