export interface AddCarModelRequest {
    nameFa: string,
    nameEn: string,
    brandId: number,
    yearOfManufacture: number,
}

export interface AddCarModelResponse {
    statusMessage: string,
}

export interface GetCarModelRequest {
    id: number,
}

export interface GetCarModelResponse {
    id: number,
    nameFa: string,
    nameEn: string,
    brandId: number,
    yearOfManufacture: number,
}

export interface ListCarModelsRequest { }

export interface ListCarModelsResponse {
    carModels: GetCarModelResponse[]
}

export interface UpdateCarModelRequest {
    id: number,
    nameFa: string,
    nameEn: string,
    brandId: number,
    yearOfManufacture: number,
}

export interface UpdateCarModelResponse {
    statusMessage: string
}

export interface DeleteCarModelRequest {
    id: number
}

export interface DeleteCarModelResponse {
    statusMessage: string
}