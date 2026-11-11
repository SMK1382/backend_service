export interface AddProductImageRequest {
    partId: number,
    url: string,
    alt: string,
}

export interface AddProductImageResponse {
    statusMessage: string,
}

export interface GetProductImageRequest {
    id: number,
}

export interface GetProductImageResponse {
    id: number,
    partId: number,
    url: string,
    alt: string | null,
    sortOrder: number,
}

export interface ListProductImagesRequest { }

export interface ListProductImagesResponse {
    productImages: GetProductImageResponse[]
}

export interface UpdateProductImageRequest {
    id: number,
    partId: number,
    url: string,
    alt: string,
    sortOrder: number,
}

export interface UpdateProductImageResponse {
    statusMessage: string
}

export interface DeleteProductImageRequest {
    id: number
}

export interface DeleteProductImageResponse {
    statusMessage: string
}