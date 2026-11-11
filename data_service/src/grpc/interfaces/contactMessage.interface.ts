export interface AddContactMessageRequest {
    name: string,
    email: string,
    phone: string,
    subject: string,
    message: string,
}

export interface AddContactMessageResponse {
    statusMessage: string,
}

export interface GetContactMessageRequest {
    id: number,
}

export interface GetContactMessageResponse {
    id: number,
    name: string,
    email: string,
    phone: string | null,
    subject: string,
    message: string,
    isRead: boolean,
}

export interface ListContactMessagesRequest { }

export interface ListContactMessagesResponse {
    contactMessages: GetContactMessageResponse[]
}

export interface UpdateContactMessageRequest {
    id: number,
    name: string,
    email: string,
    phone: string,
    subject: string,
    message: string,
    isRead: boolean,
}

export interface UpdateContactMessageResponse {
    statusMessage: string
}

export interface DeleteContactMessageRequest {
    id: number
}

export interface DeleteContactMessageResponse {
    statusMessage: string
}