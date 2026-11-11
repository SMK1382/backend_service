export interface AddReviewRequest {
    partId: number,
    userId: number,
    rating: number,
    comment: string,
    status: 'Pending' | 'Approved' | 'Rejected',
}

export interface AddReviewResponse {
    statusMessage: string,
}

export interface GetReviewRequest {
    id: number,
}

export interface GetReviewResponse {
    id: number,
    partId: number,
    userId: number,
    rating: number,
    comment: string,
    status: string,
}

export interface ListReviewsRequest { }

export interface ListReviewsResponse {
    reviews: GetReviewResponse[]
}

export interface UpdateReviewRequest {
    id: number,
    partId: number,
    userId: number,
    rating: number,
    comment: string,
    status: 'Pending' | 'Approved' | 'Rejected',
}

export interface UpdateReviewResponse {
    statusMessage: string
}

export interface DeleteReviewRequest {
    id: number
}

export interface DeleteReviewResponse {
    statusMessage: string
}