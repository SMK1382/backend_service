import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path'
import { fileURLToPath } from "node:url";
import {
    type AddContactMessageRequest,
    type AddContactMessageResponse,
    type GetContactMessageRequest,
    type GetContactMessageResponse,
    type ListContactMessagesRequest,
    type ListContactMessagesResponse,
    type UpdateContactMessageRequest,
    type UpdateContactMessageResponse,
    type DeleteContactMessageRequest,
    type DeleteContactMessageResponse
} from './interfaces/contactMessage.interface.js';
import db from '../db/index.js'
import { contactMessages } from '../db/schema.js';
import {
    eq,
} from "drizzle-orm";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "contactMessage.proto");

export const contactMessagePackageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});



export async function addContactMessage(call: grpc.ServerUnaryCall<AddContactMessageRequest, AddContactMessageResponse>, callBack: grpc.sendUnaryData<AddContactMessageResponse>) {
    try {
        const data = call.request;
        const created = await db.insert(contactMessages).values({
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            subject: data.subject,
            message: data.message,
        })
        if (created) {
            return callBack(null, { statusMessage: "contact message added" });
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "add contact message error",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `add contact message error: ${error}`,
        })
    }
}

export async function getContactMessage(call: grpc.ServerUnaryCall<GetContactMessageRequest, GetContactMessageResponse>, callBack: grpc.sendUnaryData<GetContactMessageResponse>) {
    try {
        const data = call.request

        const row = await db.select().from(contactMessages).where(eq(contactMessages.id, data.id))
        if (row[0]) {
            return callBack(null, row[0])
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "contact message not found",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `get contact message error: ${error}`,
        })
    }
}

export async function listContactMessages(call: grpc.ServerUnaryCall<ListContactMessagesRequest, ListContactMessagesResponse>, callBack: grpc.sendUnaryData<ListContactMessagesResponse>) {
    try {
        const rowList: GetContactMessageResponse[] = await db
            .select()
            .from(contactMessages)
        if (rowList) {
            return callBack(null, {
                contactMessages: rowList
            })
        }
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `list contact message error: ${error}`,
        })
    }
}

export async function updateContactMessage(call: grpc.ServerUnaryCall<UpdateContactMessageRequest, UpdateContactMessageResponse>, callBack: grpc.sendUnaryData<UpdateContactMessageResponse>) {
    try {
        const data = call.request
        const row = await db.select().from(contactMessages).where(eq(contactMessages.id, data.id))
        const result = await db
            .update(contactMessages)
            .set({
            name: data.name || row[0]?.name,
            email: data.email || row[0]?.email,
            phone: data.phone || row[0]?.phone,
            subject: data.subject || row[0]?.subject,
            message: data.message || row[0]?.message,
            isRead: data.isRead || row[0]?.isRead,
            })
            .where(eq(contactMessages.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "contact message updated" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "update contact message error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `update contact message error: ${error}`,
        })
    }
}

export async function deleteContactMessage(call: grpc.ServerUnaryCall<DeleteContactMessageRequest, DeleteContactMessageResponse>, callBack: grpc.sendUnaryData<DeleteContactMessageResponse>) {
    try {
        const data: DeleteContactMessageRequest = call.request
        const result = await db
            .delete(contactMessages)
            .where(eq(contactMessages.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "contact message deleted" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "delete contact message error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `delete contact message error: ${error}`,
        })
    }
}