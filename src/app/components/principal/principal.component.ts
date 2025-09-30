import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductTableComponent } from '../product-table/product-table.component';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, ProductTableComponent],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent {}
