export interface AddPartBrandRequest {
    name: string,
    slug: string,
    countryOfOrigin: string,
    description: string,
    status: 'Active' | 'Inactive',
}

export interface AddPartBrandResponse {
    statusMessage: string,
}

export interface GetPartBrandRequest {
    id: number,
}

export interface GetPartBrandResponse {
    id: number,
    name: string,
    slug: string,
    countryOfOrigin: string,
    description: string | null,
    status: string,
}

export interface ListPartBrandsRequest { }

export interface ListPartBrandsResponse {
    partBrands: GetPartBrandResponse[]
}

export interface UpdatePartBrandRequest {
    id: number,
    name: string,
    slug: string,
    countryOfOrigin: string,
    description: string,
    status: 'Active' | 'Inactive',
}

export interface UpdatePartBrandResponse {
    statusMessage: string
}

export interface DeletePartBrandRequest {
    id: number
}

export interface DeletePartBrandResponse {
    statusMessage: string
}