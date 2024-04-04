import { Component } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product, Products } from '../../types';
import { ProductComponent } from '../components/product/product.component';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { ApiService } from '../services/api.service';
import { EditPopupComponent } from '../components/edit-popup/edit-popup.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductComponent, CommonModule, ButtonModule, PaginatorModule, EditPopupComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(
    private productsService: ProductsService
  ) { }

  products: Product[] = []

  rows = 5

  totalRecords: number = 0

  toggleEditPopup(product: Product) {
    this.selectedProduct = product;
    this.displayEditPopup = true;
  }

  toggleDeletePopup(product: Product) {

  }

  toggleAddPopup() {
    this.displayAddProduct = true;
  }

  selectedProduct: Product = {
    id: 0,
    name: '',
    image: '',
    price: '',
    rating: 0
  }

  displayEditPopup: boolean = false;
  displayAddProduct: boolean = false;

  onConfirmEdit(product: Product) {
    if (!this.selectedProduct.id) {
      return;
    }
    this.editProduct(product, this.selectedProduct.id);
    this.displayEditPopup = false;
  }

  onConfirmAdd(product: Product) {
    this.addProduct(product);
    this.displayAddProduct = false;
  }

  onProductOutput(product: Product) {
    console.log('Output', product);
  }

  onPageChange(event: any) {
    this.fetchProducts(event.page, event.rows);
  }

  fetchProducts(page: number, perPage: number) {
    this.productsService
    .getProducts('http://localhost:3000/clothes', {page, perPage})
    .subscribe({
      next: (data: Products) => {
        this.products = data.items
        this.totalRecords = data.total;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  editProduct(product: Product, id: number) {
    this.productsService.editProduct(`http://localhost:3000/clothes/${id}`, product)
    .subscribe({
      next: (data) =>  this.fetchProducts(0, this.rows),
      error: (error) => console.log(error)
    })
  }

  deleteProduct(id: number) {
    this.productsService.deleteProduct(`http://localhost:3000/clothes/${id}`)
    .subscribe({
      next: (data) =>  this.fetchProducts(0, this.rows),
      error: (error) => console.log(error)
    })
  }

  addProduct(product: Product) {
    this.productsService.addProduct('http://localhost:3000/clothes', product)
    .subscribe({
      next: (data) =>  this.fetchProducts(0, this.rows),
      error: (error) => console.log(error)
    })
  }

  ngOnInit() {
    this.fetchProducts(0, this.rows)
  }

}
