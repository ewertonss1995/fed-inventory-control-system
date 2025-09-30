import { CategoryResponse } from "../../category/response/CategoryResponse";

export interface ProductResponseModel {
  productId: number;

  productName: string;

  productDescription: string;

  unitPrice: number;

  quantity: number;

  totalPrice: number;

  category: CategoryResponse;

  registrationDate: string;

  updateDate: string;
}
