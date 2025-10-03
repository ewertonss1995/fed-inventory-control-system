import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseModel } from '../../../shared/model/user/response/api-response.model';
import { CategoryResponseModel } from '../../../shared/model/category/response/category-response-model';
import { CategoryRequestModel } from '../../../shared/model/category/request/category-request-model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private urlCategory: string = 'http://localhost:8080/api/v1/categories';

  constructor(private http: HttpClient) { }


  createCategory(category: CategoryRequestModel): Observable<ApiResponseModel> {
    return this.http.post<ApiResponseModel>(this.urlCategory, category);
  }

  getCategoryById(categoryId: number): Observable<CategoryResponseModel> {
    return this.http.get<CategoryResponseModel>(`${this.urlCategory}/${categoryId}`);
  }

  getCategoryList(): Observable<CategoryResponseModel[]> {
    return this.http.get<CategoryResponseModel[]>(this.urlCategory);
  }

  updateCategory(categoryId: number, category: CategoryRequestModel): Observable<ApiResponseModel> {
    return this.http.put<ApiResponseModel>(`${this.urlCategory}/${categoryId}`, category);
  }

  deleteCategory(categoryId: number): Observable<ApiResponseModel> {
    return this.http.delete<ApiResponseModel>(`${this.urlCategory}/${categoryId}`);
  }

}
