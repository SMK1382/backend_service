export interface AddWishlistRequest {
    userId: number,
    partId: number,
}

export interface AddWishlistResponse {
    statusMessage: string,
}

export interface GetWishlistRequest {
    id: number,
}

export interface GetWishlistResponse {
    id: number,
    userId: number,
    partId: number,
}

export interface ListWishlistRequest { }

export interface ListWishlistResponse {
    wishlist: GetWishlistResponse[]
}

export interface UpdateWishlistRequest {
    id: number,
    userId: number,
    partId: number,
}

export interface UpdateWishlistResponse {
    statusMessage: string
}

export interface DeleteWishlistRequest {
    id: number
}

export interface DeleteWishlistResponse {
    statusMessage: string
}