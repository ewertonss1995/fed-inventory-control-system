import { CategoryResponseModel } from '../../shared/model/category/response/category-response-model';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ProductResponseModel } from '../../shared/model/product/response/product-response-model';
import { ProductService } from '../../core/services/product/product-service';
import { formatarData } from '../../shared/utils/utilitario-formatador';
import { MatDialog } from '@angular/material/dialog';
import { ActionsModal } from '../../shared/components/actions-modal/actions-modal';
import { CategoryService } from '../../core/services/category/category-service';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatIconModule],
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css']
})
export class ProductTableComponent implements OnInit {

  displayedColumns: string[] =
    [
      'productId',
      'productName',
      'productDescription',
      'unitPrice',
      'quantity',
      'totalPrice',
      'category',
      'registrationDate',
      'updateDate',
      'action'
    ];

  dataSource: any[] = [];
  categories: CategoryResponseModel[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getProducts();
    this.loadCategories();
  }

  private getProducts() {
    try {
      this.productService.getProductList()
        .subscribe((result) => {
          let products = JSON.parse(JSON.stringify(result));

          products = products.map((product: ProductResponseModel) => {
            return {
              ...product,
              category: product.category.categoryName,
              registrationDate: formatarData(product.registrationDate),
              updateDate: formatarData(product.updateDate),
              actions: { icon: "more_horiz", clickCallback: () => this.handleClickOnIcon(product) }
            };
          });

          this.dataSource = products;
          this.cdr.detectChanges();
        });
    } catch (error) {
      console.error(`Erro ao buscar produtos no banco de dados: ${error}`);
    }
  }

  private loadCategories() {
    try {
      this.categoryService.getCategoryList()
        .subscribe((result) => {
          this.categories = result;
          this.cdr.detectChanges();
        });
    } catch (error) {
      console.error(`Erro ao buscar categorias no banco de dados: ${error}`);
    }
  }

  handleClickOnIcon(product: ProductResponseModel) {
    let productId = product.productId;

    this.dialog.open(ActionsModal)
      .afterClosed().subscribe(result => {
        if (result) {
          if (result.action === 'edit') {
            this.openProductFormDialog(product, true, 'Editar Produto');
          }
          else if (result.action === 'view') {
            this.openProductFormDialog(product, false, 'Visualizar Produto');
          }
          else if (result.action === 'delete') {
            this.deleteProduct(productId);
          }
        }
      });
  }

  private openProductFormDialog(product: ProductResponseModel, enableEditing: boolean, dialogTitle: string) {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '100%',
      maxWidth: '95vw',
      height: 'auto',
      maxHeight: '90vh',
      disableClose: false,
      data: {
        product: product,
        categories: this.categories,
        isEditMode: enableEditing,
        title: dialogTitle,
        isViewOnly: !enableEditing
      },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(formResult => {
      if (formResult && enableEditing) {
        this.processProductUpdate(product.productId, formResult);
      }
    });
  }

  private processProductUpdate(productId: number, productData: any) {
    try {
      // Implementar lógica de atualização
      this.productService.updateProduct(productId, productData).subscribe({
        next: () => {
          console.log('Produto atualizado com sucesso');
          this.getProducts(); // Recarregar dados
        },
        error: (error) => {
          console.error(`Erro ao atualizar produto: ${error}`);
        }
      });
    } catch (error) {
      console.error(`Erro inesperado: ${error}`);
    }
  }

  private deleteProduct(productId: number) {
    try {
      this.productService.deleteProduct(productId).subscribe(() => {
        this.getProducts();
      });
    } catch (error) {
      console.error(`Erro ao deletar produto: ${error}`);
    }
  }
}
