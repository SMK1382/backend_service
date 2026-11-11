import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path'
import { fileURLToPath } from "node:url";
import {
    type AddReturnRequestRequest,
    type AddReturnRequestResponse,
    type GetReturnRequestRequest,
    type GetReturnRequestResponse,
    type ListReturnRequestsRequest,
    type ListReturnRequestsResponse,
    type UpdateReturnRequestRequest,
    type UpdateReturnRequestResponse,
    type DeleteReturnRequestRequest,
    type DeleteReturnRequestResponse
} from './interfaces/returnRequest.interface.js';
import db from '../db/index.js'
import { returnRequest } from '../db/schema.js';
import {
    eq,
} from "drizzle-orm";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "returnRequest.proto");

export const returnRequestPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});



export async function addReturnRequest(call: grpc.ServerUnaryCall<AddReturnRequestRequest, AddReturnRequestResponse>, callBack: grpc.sendUnaryData<AddReturnRequestResponse>) {
    try {
        const data = call.request;
        const created = await db.insert(returnRequest).values({
            orderId: data.orderId,
            userId: data.userId,
            reasonDescription: data.reasonDescription || null,
            status: data.status || undefined,
        })
        if (created) {
            return callBack(null, { statusMessage: "return request added" });
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "add return request error",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `add return request error: ${error}`,
        })
    }
}

export async function getReturnRequest(call: grpc.ServerUnaryCall<GetReturnRequestRequest, GetReturnRequestResponse>, callBack: grpc.sendUnaryData<GetReturnRequestResponse>) {
    try {
        const data = call.request

        const row = await db.select().from(returnRequest).where(eq(returnRequest.id, data.id))
        if (row[0]) {
            return callBack(null, row[0])
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "return request not found",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `get return request error: ${error}`,
        })
    }
}

export async function listReturnRequests(call: grpc.ServerUnaryCall<ListReturnRequestsRequest, ListReturnRequestsResponse>, callBack: grpc.sendUnaryData<ListReturnRequestsResponse>) {
    try {
        const rowList: GetReturnRequestResponse[] = await db
            .select()
            .from(returnRequest)
        if (rowList) {
            return callBack(null, {
                returnRequests: rowList
            })
        }
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `list return request error: ${error}`,
        })
    }
}

export async function updateReturnRequest(call: grpc.ServerUnaryCall<UpdateReturnRequestRequest, UpdateReturnRequestResponse>, callBack: grpc.sendUnaryData<UpdateReturnRequestResponse>) {
    try {
        const data = call.request
        const row = await db.select().from(returnRequest).where(eq(returnRequest.id, data.id))
        const result = await db
            .update(returnRequest)
            .set({
            orderId: data.orderId || row[0]?.orderId,
            userId: data.userId || row[0]?.userId,
            reasonDescription: data.reasonDescription || row[0]?.reasonDescription,
            status: data.status || row[0]?.status,
            })
            .where(eq(returnRequest.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "return request updated" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "update return request error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `update return request error: ${error}`,
        })
    }
}

export async function deleteReturnRequest(call: grpc.ServerUnaryCall<DeleteReturnRequestRequest, DeleteReturnRequestResponse>, callBack: grpc.sendUnaryData<DeleteReturnRequestResponse>) {
    try {
        const data: DeleteReturnRequestRequest = call.request
        const result = await db
            .delete(returnRequest)
            .where(eq(returnRequest.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "return request deleted" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "delete return request error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `delete return request error: ${error}`,
        })
    }
}