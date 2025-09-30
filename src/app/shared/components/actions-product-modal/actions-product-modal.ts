import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-actions-product-modal',
  imports: [MatIconModule],
  templateUrl: './actions-product-modal.html',
  styleUrl: './actions-product-modal.scss'
})

export class ActionsProductModal {
  onEdit() {
    // lógica de edição
    alert('Editar produto');
  }

  onView() {
    // lógica de visualização
    alert('Visualizar produto');
  }

  onDelete() {
    // lógica de deleção
    alert('Deletar produto');
  }
}
