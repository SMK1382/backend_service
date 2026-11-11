export interface AddOrderRequest {
    userId: number,
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled',
    paymentMethod: 'Cod' | 'Card_Transfer',
    paymentStatus: 'Unpaid' | 'Paid' | 'Refunded',
    receiverName: string,
    receiverPhone: string,
    province: string,
    city: string,
    postalCode: string,
    addressLine: string,
    note: string,
    itemsSubtotal: number,
    discountAmount: number,
    shippingCost: number,
    totalAmount: number,
    trackingCode: string,
}

export interface AddOrderResponse {
    statusMessage: string,
}

export interface GetOrderRequest {
    id: number,
}

export interface GetOrderResponse {
    id: number,
    userId: number,
    status: string,
    paymentMethod: string,
    paymentStatus: string,
    receiverName: string,
    receiverPhone: string,
    province: string,
    city: string,
    postalCode: string,
    addressLine: string,
    note: string | null,
    itemsSubtotal: number,
    discountAmount: number,
    shippingCost: number,
    totalAmount: number,
    trackingCode: string | null,
}

export interface ListOrdersRequest { }

export interface ListOrdersResponse {
    orders: GetOrderResponse[]
}

export interface UpdateOrderRequest {
    id: number,
    userId: number,
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled',
    paymentMethod: 'Cod' | 'Card_Transfer',
    paymentStatus: 'Unpaid' | 'Paid' | 'Refunded',
    receiverName: string,
    receiverPhone: string,
    province: string,
    city: string,
    postalCode: string,
    addressLine: string,
    note: string,
    itemsSubtotal: number,
    discountAmount: number,
    shippingCost: number,
    totalAmount: number,
    trackingCode: string,
}

export interface UpdateOrderResponse {
    statusMessage: string
}

export interface DeleteOrderRequest {
    id: number
}

export interface DeleteOrderResponse {
    statusMessage: string
}