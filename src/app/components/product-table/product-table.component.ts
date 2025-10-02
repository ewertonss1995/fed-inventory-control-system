import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ProductResponseModel } from '../../shared/model/product/response/product-response-model';
import { ProductService } from '../../core/services/product/product-service';
import { formatarData } from '../../shared/utils/utilitario-formatador';
import { MatDialog } from '@angular/material/dialog';
import { ActionsProductModal } from '../../shared/components/actions-product-modal/actions-product-modal';
import { ProductRequestModel } from '../../shared/model/product/request/product-request-model';

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

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getProducts();
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

  handleClickOnIcon(product: ProductResponseModel) {
    let productId = product.productId;

    this.dialog.open(ActionsProductModal)
      .afterClosed().subscribe(result => {
        if (result) {
          if (result.action === 'edit') {
          } else if (result.action === 'view') {
            alert(`Visualizar produto: ${productId} - Ação: ${result.action}`);
          } else if (result.action === 'delete') {
            this.deleteProduct(productId);
          }
        }
      });
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
