import { CategoryResponseModel } from "../../category/response/category-response-model";

export interface ProductResponseModel {
  productId: number;

  productName: string;

  productDescription: string;

  unitPrice: number;

  quantity: number;

  totalPrice: number;

  category: CategoryResponseModel;

  registrationDate: string;

  updateDate: string;
}
