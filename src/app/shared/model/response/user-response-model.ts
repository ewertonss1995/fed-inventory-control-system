import { UserRoleResponseModel } from "./user-role-response";

export interface UserResponseModel {
    userEmail: string;
    userName: string;
    password: string;
    roles: UserRoleResponseModel[];
}
