export interface AddSupplierRequest {
    supplierName: string,
    supplierType: 'Manufacturer' | 'Importer' | 'Distributor' | 'Official_Representative',
    contactPersonName: string,
    nationalCode: string,
    phoneNumber: string,
    bankAccountNumber: string,
    score: number,
    status: 'Active' | 'Inactive',
    description: string,
}

export interface AddSupplierResponse {
    statusMessage: string,
}

export interface GetSupplierRequest {
    id: number,
}

export interface GetSupplierResponse {
    id: number,
    supplierName: string,
    supplierType: string,
    contactPersonName: string,
    nationalCode: string,
    phoneNumber: string,
    bankAccountNumber: string,
    score: number,
    status: string,
    description: string,
}

export interface ListSuppliersRequest { }

export interface ListSuppliersResponse {
    suppliers: GetSupplierResponse[]
}

export interface UpdateSupplierRequest {
    id: number,
    supplierName: string,
    supplierType: 'Manufacturer' | 'Importer' | 'Distributor' | 'Official_Representative',
    contactPersonName: string,
    nationalCode: string,
    phoneNumber: string,
    bankAccountNumber: string,
    score: number,
    status: 'Active' | 'Inactive',
    description: string,
}

export interface UpdateSupplierResponse {
    statusMessage: string
}

export interface DeleteSupplierRequest {
    id: number
}

export interface DeleteSupplierResponse {
    statusMessage: string
}