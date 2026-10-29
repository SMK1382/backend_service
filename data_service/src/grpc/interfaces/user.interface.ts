export interface AddUserRequest {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    nationalCode: string,
    password: string
}

export interface AddUserResponse {
    statusMessage: string,
}

export interface GetUserRequest {
    phone: string,
}

export interface GetUserResponse {
    isRegister: boolean
}

export interface UpdateUserRequest {
    phone: string,
}

export interface UpdateUserResponse {
    statusMessage: string
}

export interface DeleteUserRequest {
    phone: string
}

export interface DeleteUserResponse {
  statusMessage : string
}