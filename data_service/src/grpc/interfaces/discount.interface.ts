export interface AddDiscountRequest {
    name: string,
    amount: number,
    discountType: 'percentage' | 'fixed_amount',
    status: 'Active' | 'Inactive',
}

export interface AddDiscountResponse {
    statusMessage: string,
}

export interface GetDiscountRequest {
    id: number,
}

export interface GetDiscountResponse {
    id: number,
    name: string,
    amount: number,
    discountType: string,
    status: string,
}

export interface ListDiscountsRequest { }

export interface ListDiscountsResponse {
    discounts: GetDiscountResponse[]
}

export interface UpdateDiscountRequest {
    id: number,
    name: string,
    amount: number,
    discountType: 'percentage' | 'fixed_amount',
    status: 'Active' | 'Inactive',
}

export interface UpdateDiscountResponse {
    statusMessage: string
}

export interface DeleteDiscountRequest {
    id: number
}

export interface DeleteDiscountResponse {
    statusMessage: string
}