export interface AddCategoryRequest {
    name: string,
    slug: string,
    parentId: number,
}

export interface AddCategoryResponse {
    statusMessage: string,
}

export interface GetCategoryRequest {
    id: number,
}

export interface GetCategoryResponse {
    id: number,
    name: string,
    slug: string,
    parentId: number | null,
    sortOrder: number,
    isActive: boolean,
}

export interface ListCategoriesRequest { }

export interface ListCategoriesResponse {
    categories: GetCategoryResponse[]
}

export interface UpdateCategoryRequest {
    id: number,
    name: string,
    slug: string,
    parentId: number,
    sortOrder: number,
    isActive: boolean,
}

export interface UpdateCategoryResponse {
    statusMessage: string
}

export interface DeleteCategoryRequest {
    id: number
}

export interface DeleteCategoryResponse {
    statusMessage: string
}