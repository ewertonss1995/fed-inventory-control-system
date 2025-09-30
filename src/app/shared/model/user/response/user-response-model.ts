import { UserRoleResponseModel } from "./user-role-response-model";

export interface UserResponseModel {
    userEmail: string;
    userName: string;
    password: string;
    roles: UserRoleResponseModel[];
}
