import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-actions-product-modal',
  imports: [MatIconModule],
  templateUrl: './actions-product-modal.html',
  styleUrl: './actions-product-modal.scss'
})
export class ActionsProductModal {

  constructor(
    @Inject(MAT_DIALOG_DATA) public productId: number,
    private dialogRef: MatDialogRef<ActionsProductModal>) { }

  onEdit() {
    alert('Editar produto: ' + this.productId);
  }

  onView() {
    alert('Visualizar produto: ' + this.productId);
  }

  onDelete() {
    alert('Deletar produto: ' + this.productId);
  }

  onClose() {
    this.dialogRef.close();
  }
}
