import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-actions-product-modal',
  imports: [MatIconModule],
  templateUrl: './actions-product-modal.html',
  styleUrl: './actions-product-modal.scss'
})
export class ActionsProductModal {

  constructor(private dialogRef: MatDialogRef<ActionsProductModal>) { }

  onEdit() {
    this.dialogRef.close({ action: 'edit' });
  }

  onView() {
    this.dialogRef.close({ action: 'view' });
  }

  onDelete() {
    this.dialogRef.close({ action: 'delete' });
  }

  onClose() {
    this.dialogRef.close();
  }
}
