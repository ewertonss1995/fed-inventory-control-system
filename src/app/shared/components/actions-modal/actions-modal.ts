import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-actions-modal',
  imports: [MatIconModule],
  templateUrl: './actions-modal.html',
  styleUrl: './actions-modal.scss'
})
export class ActionsModal {

  constructor(private dialogRef: MatDialogRef<ActionsModal>) { }

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
