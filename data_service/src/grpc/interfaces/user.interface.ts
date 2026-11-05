export interface AddUserRequest {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    nationalCode: string,
}

export interface AddUserResponse {
    statusMessage: string,
}

export interface GetUserRequest {
    phone: string,
}

export interface GetUserResponse {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    nationalCode: string,
    status: string,
    role: string
}

export interface ListUsersRequest { }
export interface ListUsersResponse {
    users: GetUserResponse[]
}

// export type GetUsersResponse = Array<GetUserResponse>
export interface UpdateUserRequest {
    phone: string,
    firstName: string,
    lastName: string,
    email: string,
    status: "Active" | "Inactive",
    role: 'Super_Admin' | 'Super' | 'User',
}

export interface UpdateUserResponse {
    statusMessage: string
}

export interface DeleteUserRequest {
    phone: string
}

export interface DeleteUserResponse {
    statusMessage: string
}