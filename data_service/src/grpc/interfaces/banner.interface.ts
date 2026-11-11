export interface AddBannerRequest {
    title: string,
    subtitle: string,
    imageUrl: string,
    linkUrl: string,
}

export interface AddBannerResponse {
    statusMessage: string,
}

export interface GetBannerRequest {
    id: number,
}

export interface GetBannerResponse {
    id: number,
    title: string,
    subtitle: string | null,
    imageUrl: string,
    linkUrl: string,
    sortOrder: number,
    isActive: boolean,
}

export interface ListBannersRequest { }

export interface ListBannersResponse {
    banners: GetBannerResponse[]
}

export interface UpdateBannerRequest {
    id: number,
    title: string,
    subtitle: string,
    imageUrl: string,
    linkUrl: string,
    sortOrder: number,
    isActive: boolean,
}

export interface UpdateBannerResponse {
    statusMessage: string
}

export interface DeleteBannerRequest {
    id: number
}

export interface DeleteBannerResponse {
    statusMessage: string
}