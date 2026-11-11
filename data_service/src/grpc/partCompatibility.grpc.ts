import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path'
import { fileURLToPath } from "node:url";
import {
    type AddPartCompatibilityRequest,
    type AddPartCompatibilityResponse,
    type GetPartCompatibilityRequest,
    type GetPartCompatibilityResponse,
    type ListPartCompatibilitiesRequest,
    type ListPartCompatibilitiesResponse,
    type UpdatePartCompatibilityRequest,
    type UpdatePartCompatibilityResponse,
    type DeletePartCompatibilityRequest,
    type DeletePartCompatibilityResponse
} from './interfaces/partCompatibility.interface.js';
import db from '../db/index.js'
import { partCompatibility } from '../db/schema.js';
import {
    eq,
} from "drizzle-orm";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "partCompatibility.proto");

export const partCompatibilityPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});



export async function addPartCompatibility(call: grpc.ServerUnaryCall<AddPartCompatibilityRequest, AddPartCompatibilityResponse>, callBack: grpc.sendUnaryData<AddPartCompatibilityResponse>) {
    try {
        const data = call.request;
        const created = await db.insert(partCompatibility).values({
            partId: data.partId,
            carModelId: data.carModelId,
            yearsNote: data.yearsNote,
        })
        if (created) {
            return callBack(null, { statusMessage: "part compatibility added" });
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "add part compatibility error",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `add part compatibility error: ${error}`,
        })
    }
}

export async function getPartCompatibility(call: grpc.ServerUnaryCall<GetPartCompatibilityRequest, GetPartCompatibilityResponse>, callBack: grpc.sendUnaryData<GetPartCompatibilityResponse>) {
    try {
        const data = call.request

        const row = await db.select().from(partCompatibility).where(eq(partCompatibility.id, data.id))
        if (row[0]) {
            return callBack(null, row[0])
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "part compatibility not found",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `get part compatibility error: ${error}`,
        })
    }
}

export async function listPartCompatibilities(call: grpc.ServerUnaryCall<ListPartCompatibilitiesRequest, ListPartCompatibilitiesResponse>, callBack: grpc.sendUnaryData<ListPartCompatibilitiesResponse>) {
    try {
        const rowList: GetPartCompatibilityResponse[] = await db
            .select()
            .from(partCompatibility)
        if (rowList) {
            return callBack(null, {
                partCompatibilities: rowList
            })
        }
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `list part compatibility error: ${error}`,
        })
    }
}

export async function updatePartCompatibility(call: grpc.ServerUnaryCall<UpdatePartCompatibilityRequest, UpdatePartCompatibilityResponse>, callBack: grpc.sendUnaryData<UpdatePartCompatibilityResponse>) {
    try {
        const data = call.request
        const row = await db.select().from(partCompatibility).where(eq(partCompatibility.id, data.id))
        const result = await db
            .update(partCompatibility)
            .set({
            partId: data.partId || row[0]?.partId,
            carModelId: data.carModelId || row[0]?.carModelId,
            yearsNote: data.yearsNote || row[0]?.yearsNote,
            })
            .where(eq(partCompatibility.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "part compatibility updated" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "update part compatibility error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `update part compatibility error: ${error}`,
        })
    }
}

export async function deletePartCompatibility(call: grpc.ServerUnaryCall<DeletePartCompatibilityRequest, DeletePartCompatibilityResponse>, callBack: grpc.sendUnaryData<DeletePartCompatibilityResponse>) {
    try {
        const data: DeletePartCompatibilityRequest = call.request
        const result = await db
            .delete(partCompatibility)
            .where(eq(partCompatibility.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "part compatibility deleted" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "delete part compatibility error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `delete part compatibility error: ${error}`,
        })
    }
}