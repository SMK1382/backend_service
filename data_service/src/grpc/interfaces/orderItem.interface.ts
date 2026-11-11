export interface AddOrderItemRequest {
    orderId: number,
    partId: number,
    partName: string,
    partNumber: string,
    imageUrl: string,
    unitPrice: number,
}

export interface AddOrderItemResponse {
    statusMessage: string,
}

export interface GetOrderItemRequest {
    id: number,
}

export interface GetOrderItemResponse {
    id: number,
    orderId: number,
    partId: number,
    partName: string,
    partNumber: string | null,
    imageUrl: string | null,
    quantity: number,
    unitPrice: number,
}

export interface ListOrderItemsRequest { }

export interface ListOrderItemsResponse {
    orderItems: GetOrderItemResponse[]
}

export interface UpdateOrderItemRequest {
    id: number,
    orderId: number,
    partId: number,
    partName: string,
    partNumber: string,
    imageUrl: string,
    quantity: number,
    unitPrice: number,
}

export interface UpdateOrderItemResponse {
    statusMessage: string
}

export interface DeleteOrderItemRequest {
    id: number
}

export interface DeleteOrderItemResponse {
    statusMessage: string
}