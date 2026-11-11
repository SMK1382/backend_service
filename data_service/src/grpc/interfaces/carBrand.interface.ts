export interface AddCarBrandRequest {
    name: string,
    slug: string,
    country: string,
    description: string,
}

export interface AddCarBrandResponse {
    statusMessage: string,
}

export interface GetCarBrandRequest {
    id: number,
}

export interface GetCarBrandResponse {
    id: number,
    name: string,
    slug: string,
    country: string,
    description: string | null,
    isActive: boolean,
}

export interface ListCarBrandsRequest { }

export interface ListCarBrandsResponse {
    carBrands: GetCarBrandResponse[]
}

export interface UpdateCarBrandRequest {
    id: number,
    name: string,
    slug: string,
    country: string,
    description: string,
    isActive: boolean,
}

export interface UpdateCarBrandResponse {
    statusMessage: string
}

export interface DeleteCarBrandRequest {
    id: number
}

export interface DeleteCarBrandResponse {
    statusMessage: string
}