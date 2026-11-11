import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path'
import { fileURLToPath } from "node:url";
import {
    type AddPartRequest,
    type AddPartResponse,
    type GetPartRequest,
    type GetPartResponse,
    type ListPartsRequest,
    type ListPartsResponse,
    type UpdatePartRequest,
    type UpdatePartResponse,
    type DeletePartRequest,
    type DeletePartResponse
} from './interfaces/part.interface.js';
import db from '../db/index.js'
import { parts } from '../db/schema.js';
import {
    eq,
} from "drizzle-orm";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "part.proto");

export const partPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});



export async function addPart(call: grpc.ServerUnaryCall<AddPartRequest, AddPartResponse>, callBack: grpc.sendUnaryData<AddPartResponse>) {
    try {
        const data = call.request;
        const created = await db.insert(parts).values({
            name: data.name,
            slug: data.slug,
            brandId: data.brandId || null,
            description: data.description || null,
            price: data.price,
            discountAmount: data.discountAmount || null,
            partNumber: data.partNumber || null,
            weightGrams: data.weightGrams || null,
            supplier_id: data.supplierId,
            unit: data.unit || undefined,
            categoryId: data.categoryId || null,
            status: data.status || undefined,
            metaTitle: data.metaTitle || null,
            metaDescription: data.metaDescription || null,
        })
        if (created) {
            return callBack(null, { statusMessage: "part added" });
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "add part error",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `add part error: ${error}`,
        })
    }
}

export async function getPart(call: grpc.ServerUnaryCall<GetPartRequest, GetPartResponse>, callBack: grpc.sendUnaryData<GetPartResponse>) {
    try {
        const data = call.request

        const row = await db.select().from(parts).where(eq(parts.id, data.id))
        if (row[0]) {
            return callBack(null, { ...row[0], supplierId: row[0].supplier_id })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "part not found",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `get part error: ${error}`,
        })
    }
}

export async function listParts(call: grpc.ServerUnaryCall<ListPartsRequest, ListPartsResponse>, callBack: grpc.sendUnaryData<ListPartsResponse>) {
    try {
        const rowList = await db
            .select()
            .from(parts)
        if (rowList) {
            return callBack(null, {
                parts: rowList.map((row) => ({ ...row, supplierId: row.supplier_id }))
            })
        }
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `list part error: ${error}`,
        })
    }
}

export async function updatePart(call: grpc.ServerUnaryCall<UpdatePartRequest, UpdatePartResponse>, callBack: grpc.sendUnaryData<UpdatePartResponse>) {
    try {
        const data = call.request
        const row = await db.select().from(parts).where(eq(parts.id, data.id))
        const result = await db
            .update(parts)
            .set({
            name: data.name || row[0]?.name,
            slug: data.slug || row[0]?.slug,
            brandId: data.brandId || row[0]?.brandId,
            description: data.description || row[0]?.description,
            price: data.price || row[0]?.price,
            discountAmount: data.discountAmount || row[0]?.discountAmount,
            stock: data.stock || row[0]?.stock,
            partNumber: data.partNumber || row[0]?.partNumber,
            weightGrams: data.weightGrams || row[0]?.weightGrams,
            supplier_id: data.supplierId || row[0]?.supplier_id,
            unit: data.unit || row[0]?.unit,
            categoryId: data.categoryId || row[0]?.categoryId,
            status: data.status || row[0]?.status,
            isFeatured: data.isFeatured || row[0]?.isFeatured,
            metaTitle: data.metaTitle || row[0]?.metaTitle,
            metaDescription: data.metaDescription || row[0]?.metaDescription,
            })
            .where(eq(parts.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "part updated" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "update part error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `update part error: ${error}`,
        })
    }
}

export async function deletePart(call: grpc.ServerUnaryCall<DeletePartRequest, DeletePartResponse>, callBack: grpc.sendUnaryData<DeletePartResponse>) {
    try {
        const data: DeletePartRequest = call.request
        const result = await db
            .delete(parts)
            .where(eq(parts.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "part deleted" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "delete part error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `delete part error: ${error}`,
        })
    }
}