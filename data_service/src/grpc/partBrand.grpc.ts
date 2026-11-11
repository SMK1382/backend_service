import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path'
import { fileURLToPath } from "node:url";
import {
    type AddPartBrandRequest,
    type AddPartBrandResponse,
    type GetPartBrandRequest,
    type GetPartBrandResponse,
    type ListPartBrandsRequest,
    type ListPartBrandsResponse,
    type UpdatePartBrandRequest,
    type UpdatePartBrandResponse,
    type DeletePartBrandRequest,
    type DeletePartBrandResponse
} from './interfaces/partBrand.interface.js';
import db from '../db/index.js'
import { partBrands } from '../db/schema.js';
import {
    eq,
} from "drizzle-orm";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "partBrand.proto");

export const partBrandPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});



export async function addPartBrand(call: grpc.ServerUnaryCall<AddPartBrandRequest, AddPartBrandResponse>, callBack: grpc.sendUnaryData<AddPartBrandResponse>) {
    try {
        const data = call.request;
        const created = await db.insert(partBrands).values({
            name: data.name,
            slug: data.slug,
            countryOfOrigin: data.countryOfOrigin,
            description: data.description || null,
            status: data.status || undefined,
        })
        if (created) {
            return callBack(null, { statusMessage: "part brand added" });
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "add part brand error",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `add part brand error: ${error}`,
        })
    }
}

export async function getPartBrand(call: grpc.ServerUnaryCall<GetPartBrandRequest, GetPartBrandResponse>, callBack: grpc.sendUnaryData<GetPartBrandResponse>) {
    try {
        const data = call.request

        const row = await db.select().from(partBrands).where(eq(partBrands.id, data.id))
        if (row[0]) {
            return callBack(null, row[0])
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "part brand not found",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `get part brand error: ${error}`,
        })
    }
}

export async function listPartBrands(call: grpc.ServerUnaryCall<ListPartBrandsRequest, ListPartBrandsResponse>, callBack: grpc.sendUnaryData<ListPartBrandsResponse>) {
    try {
        const rowList: GetPartBrandResponse[] = await db
            .select()
            .from(partBrands)
        if (rowList) {
            return callBack(null, {
                partBrands: rowList
            })
        }
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `list part brand error: ${error}`,
        })
    }
}

export async function updatePartBrand(call: grpc.ServerUnaryCall<UpdatePartBrandRequest, UpdatePartBrandResponse>, callBack: grpc.sendUnaryData<UpdatePartBrandResponse>) {
    try {
        const data = call.request
        const row = await db.select().from(partBrands).where(eq(partBrands.id, data.id))
        const result = await db
            .update(partBrands)
            .set({
            name: data.name || row[0]?.name,
            slug: data.slug || row[0]?.slug,
            countryOfOrigin: data.countryOfOrigin || row[0]?.countryOfOrigin,
            description: data.description || row[0]?.description,
            status: data.status || row[0]?.status,
            })
            .where(eq(partBrands.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "part brand updated" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "update part brand error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `update part brand error: ${error}`,
        })
    }
}

export async function deletePartBrand(call: grpc.ServerUnaryCall<DeletePartBrandRequest, DeletePartBrandResponse>, callBack: grpc.sendUnaryData<DeletePartBrandResponse>) {
    try {
        const data: DeletePartBrandRequest = call.request
        const result = await db
            .delete(partBrands)
            .where(eq(partBrands.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "part brand deleted" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "delete part brand error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `delete part brand error: ${error}`,
        })
    }
}