import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { UserModel } from '../../../shared/model/user/request/user-model';
import { ApiResponseModel } from '../../../shared/model/user/response/api-response.model';
import { UserResponseModel } from '../../../shared/model/user/response/user-response-model';
import { UserLoginResponseModel } from '../../../shared/model/user/response/user-login-response-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private urlUser: string = 'http://localhost:8080/api/v1/users';

  constructor(private http: HttpClient) {}

  userLogin(user: UserModel): Observable<UserLoginResponseModel> {
    return this.http.post<UserLoginResponseModel>(`${this.urlUser}/login`, user);
  }

  getUserById(userId: number): Observable<UserResponseModel> {
    return this.http.get<UserResponseModel>(`${this.urlUser}/${userId}`);
  }

  getUsers(): Observable<UserResponseModel[]> {
    return this.http.get<UserResponseModel[]>(`${this.urlUser}/all`);
  }

  updateUser(userId: number, user: UserModel): Observable<ApiResponseModel> {
    return this.http.put<ApiResponseModel>(`${this.urlUser}/${userId}`, user);
  }

  createUser(user: UserModel): Observable<ApiResponseModel> {
    return this.http.post<ApiResponseModel>(this.urlUser, user);
  }

  deleteUser(userId: number): Observable<ApiResponseModel> {
    return this.http.delete<ApiResponseModel>(`${this.urlUser}/${userId}`);
  }
}
