export interface AddShoppingCartRequest {
    userId: number,
    partId: number,
}

export interface AddShoppingCartResponse {
    statusMessage: string,
}

export interface GetShoppingCartRequest {
    id: number,
}

export interface GetShoppingCartResponse {
    id: number,
    userId: number,
    partId: number,
    quantity: number,
}

export interface ListShoppingCartRequest { }

export interface ListShoppingCartResponse {
    shoppingCart: GetShoppingCartResponse[]
}

export interface UpdateShoppingCartRequest {
    id: number,
    userId: number,
    partId: number,
    quantity: number,
}

export interface UpdateShoppingCartResponse {
    statusMessage: string
}

export interface DeleteShoppingCartRequest {
    id: number
}

export interface DeleteShoppingCartResponse {
    statusMessage: string
}