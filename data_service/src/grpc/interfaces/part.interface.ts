export interface AddPartRequest {
    name: string,
    slug: string,
    brandId: number,
    description: string,
    price: number,
    discountAmount: number,
    partNumber: string,
    weightGrams: number,
    supplierId: number,
    unit: 'Number' | 'Pair' | 'Set',
    categoryId: number,
    status: 'Active' | 'Inactive',
    metaTitle: string,
    metaDescription: string,
}

export interface AddPartResponse {
    statusMessage: string,
}

export interface GetPartRequest {
    id: number,
}

export interface GetPartResponse {
    id: number,
    name: string,
    slug: string,
    brandId: number | null,
    description: string | null,
    price: number,
    discountAmount: number | null,
    stock: number,
    partNumber: string | null,
    weightGrams: number | null,
    supplierId: number,
    unit: string,
    categoryId: number | null,
    status: string,
    isFeatured: boolean,
    metaTitle: string | null,
    metaDescription: string | null,
}

export interface ListPartsRequest { }

export interface ListPartsResponse {
    parts: GetPartResponse[]
}

export interface UpdatePartRequest {
    id: number,
    name: string,
    slug: string,
    brandId: number,
    description: string,
    price: number,
    discountAmount: number,
    stock: number,
    partNumber: string,
    weightGrams: number,
    supplierId: number,
    unit: 'Number' | 'Pair' | 'Set',
    categoryId: number,
    status: 'Active' | 'Inactive',
    isFeatured: boolean,
    metaTitle: string,
    metaDescription: string,
}

export interface UpdatePartResponse {
    statusMessage: string
}

export interface DeletePartRequest {
    id: number
}

export interface DeletePartResponse {
    statusMessage: string
}