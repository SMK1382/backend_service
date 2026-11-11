export interface AddReturnRequestRequest {
    orderId: number,
    userId: number,
    reasonDescription: string,
    status: 'Active' | 'Inactive',
}

export interface AddReturnRequestResponse {
    statusMessage: string,
}

export interface GetReturnRequestRequest {
    id: number,
}

export interface GetReturnRequestResponse {
    id: number,
    orderId: number,
    userId: number,
    reasonDescription: string | null,
    status: string,
}

export interface ListReturnRequestsRequest { }

export interface ListReturnRequestsResponse {
    returnRequests: GetReturnRequestResponse[]
}

export interface UpdateReturnRequestRequest {
    id: number,
    orderId: number,
    userId: number,
    reasonDescription: string,
    status: 'Active' | 'Inactive',
}

export interface UpdateReturnRequestResponse {
    statusMessage: string
}

export interface DeleteReturnRequestRequest {
    id: number
}

export interface DeleteReturnRequestResponse {
    statusMessage: string
}