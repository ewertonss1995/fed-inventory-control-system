import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductResponseModel } from '../../../shared/model/product/response/product-response-model';
import { Observable } from 'rxjs';
import { ProductRequestModel } from '../../../shared/model/product/request/product-request-model';
import { ApiResponseModel } from '../../../shared/model/user/response/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private urlProduct: string = 'http://localhost:8080/api/v1/products';

  constructor(private http: HttpClient) { }


  createProduct(product: ProductRequestModel): Observable<ApiResponseModel> {
    return this.http.post<ApiResponseModel>(this.urlProduct, product);
  }

  getProductById(productId: number): Observable<ProductResponseModel> {
    return this.http.get<ProductResponseModel>(`${this.urlProduct}/${productId}`);
  }

  getProductList(): Observable<ProductResponseModel[]> {
    return this.http.get<ProductResponseModel[]>(`${this.urlProduct}`);
  }

  updateProduct(productId: number, product: ProductRequestModel): Observable<ApiResponseModel> {
    return this.http.put<ApiResponseModel>(`${this.urlProduct}/${productId}`, product);
  }

  deleteProduct(productId: number): Observable<ApiResponseModel> {
    return this.http.delete<ApiResponseModel>(`${this.urlProduct}/${productId}`);
  }

}
