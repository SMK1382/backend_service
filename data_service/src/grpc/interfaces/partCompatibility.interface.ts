export interface AddPartCompatibilityRequest {
    partId: number,
    carModelId: number,
    yearsNote: string,
}

export interface AddPartCompatibilityResponse {
    statusMessage: string,
}

export interface GetPartCompatibilityRequest {
    id: number,
}

export interface GetPartCompatibilityResponse {
    id: number,
    partId: number,
    carModelId: number,
    yearsNote: string,
}

export interface ListPartCompatibilitiesRequest { }

export interface ListPartCompatibilitiesResponse {
    partCompatibilities: GetPartCompatibilityResponse[]
}

export interface UpdatePartCompatibilityRequest {
    id: number,
    partId: number,
    carModelId: number,
    yearsNote: string,
}

export interface UpdatePartCompatibilityResponse {
    statusMessage: string
}

export interface DeletePartCompatibilityRequest {
    id: number
}

export interface DeletePartCompatibilityResponse {
    statusMessage: string
}