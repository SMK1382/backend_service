export interface AddAddressRequest {
    userId: number,
    receiverName: string,
    receiverPhone: string,
    province: string,
    city: string,
    postalCode: string,
    line: string,
}

export interface AddAddressResponse {
    statusMessage: string,
}

export interface GetAddressRequest {
    id: number,
}

export interface GetAddressResponse {
    id: number,
    userId: number,
    receiverName: string,
    receiverPhone: string,
    province: string,
    city: string,
    postalCode: string,
    line: string,
    isDefault: boolean,
}

export interface ListAddressesRequest { }

export interface ListAddressesResponse {
    addresses: GetAddressResponse[]
}

export interface UpdateAddressRequest {
    id: number,
    userId: number,
    receiverName: string,
    receiverPhone: string,
    province: string,
    city: string,
    postalCode: string,
    line: string,
    isDefault: boolean,
}

export interface UpdateAddressResponse {
    statusMessage: string
}

export interface DeleteAddressRequest {
    id: number
}

export interface DeleteAddressResponse {
    statusMessage: string
}