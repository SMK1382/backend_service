import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path'
import { fileURLToPath } from "node:url";
import {
    type AddAddressRequest,
    type AddAddressResponse,
    type GetAddressRequest,
    type GetAddressResponse,
    type ListAddressesRequest,
    type ListAddressesResponse,
    type UpdateAddressRequest,
    type UpdateAddressResponse,
    type DeleteAddressRequest,
    type DeleteAddressResponse
} from './interfaces/address.interface.js';
import db from '../db/index.js'
import { addresses } from '../db/schema.js';
import {
    eq,
} from "drizzle-orm";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "address.proto");

export const addressPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});



export async function addAddress(call: grpc.ServerUnaryCall<AddAddressRequest, AddAddressResponse>, callBack: grpc.sendUnaryData<AddAddressResponse>) {
    try {
        const data = call.request;
        const created = await db.insert(addresses).values({
            userId: data.userId,
            receiverName: data.receiverName,
            receiverPhone: data.receiverPhone,
            province: data.province,
            city: data.city,
            postalCode: data.postalCode,
            line: data.line,
        })
        if (created) {
            return callBack(null, { statusMessage: "address added" });
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "add address error",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `add address error: ${error}`,
        })
    }
}

export async function getAddress(call: grpc.ServerUnaryCall<GetAddressRequest, GetAddressResponse>, callBack: grpc.sendUnaryData<GetAddressResponse>) {
    try {
        const data = call.request

        const row = await db.select().from(addresses).where(eq(addresses.id, data.id))
        if (row[0]) {
            return callBack(null, row[0])
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "address not found",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `get address error: ${error}`,
        })
    }
}

export async function listAddresses(call: grpc.ServerUnaryCall<ListAddressesRequest, ListAddressesResponse>, callBack: grpc.sendUnaryData<ListAddressesResponse>) {
    try {
        const rowList: GetAddressResponse[] = await db
            .select()
            .from(addresses)
        if (rowList) {
            return callBack(null, {
                addresses: rowList
            })
        }
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `list address error: ${error}`,
        })
    }
}

export async function updateAddress(call: grpc.ServerUnaryCall<UpdateAddressRequest, UpdateAddressResponse>, callBack: grpc.sendUnaryData<UpdateAddressResponse>) {
    try {
        const data = call.request
        const row = await db.select().from(addresses).where(eq(addresses.id, data.id))
        const result = await db
            .update(addresses)
            .set({
            userId: data.userId || row[0]?.userId,
            receiverName: data.receiverName || row[0]?.receiverName,
            receiverPhone: data.receiverPhone || row[0]?.receiverPhone,
            province: data.province || row[0]?.province,
            city: data.city || row[0]?.city,
            postalCode: data.postalCode || row[0]?.postalCode,
            line: data.line || row[0]?.line,
            isDefault: data.isDefault || row[0]?.isDefault,
            })
            .where(eq(addresses.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "address updated" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "update address error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `update address error: ${error}`,
        })
    }
}

export async function deleteAddress(call: grpc.ServerUnaryCall<DeleteAddressRequest, DeleteAddressResponse>, callBack: grpc.sendUnaryData<DeleteAddressResponse>) {
    try {
        const data: DeleteAddressRequest = call.request
        const result = await db
            .delete(addresses)
            .where(eq(addresses.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "address deleted" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "delete address error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `delete address error: ${error}`,
        })
    }
}