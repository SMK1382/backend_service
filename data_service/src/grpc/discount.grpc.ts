import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path'
import { fileURLToPath } from "node:url";
import {
    type AddDiscountRequest,
    type AddDiscountResponse,
    type GetDiscountRequest,
    type GetDiscountResponse,
    type ListDiscountsRequest,
    type ListDiscountsResponse,
    type UpdateDiscountRequest,
    type UpdateDiscountResponse,
    type DeleteDiscountRequest,
    type DeleteDiscountResponse
} from './interfaces/discount.interface.js';
import db from '../db/index.js'
import { discounts } from '../db/schema.js';
import {
    eq,
} from "drizzle-orm";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "discount.proto");

export const discountPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});



export async function addDiscount(call: grpc.ServerUnaryCall<AddDiscountRequest, AddDiscountResponse>, callBack: grpc.sendUnaryData<AddDiscountResponse>) {
    try {
        const data = call.request;
        const created = await db.insert(discounts).values({
            name: data.name,
            amount: data.amount,
            discountType: data.discountType || undefined,
            status: data.status || undefined,
        })
        if (created) {
            return callBack(null, { statusMessage: "discount added" });
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "add discount error",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `add discount error: ${error}`,
        })
    }
}

export async function getDiscount(call: grpc.ServerUnaryCall<GetDiscountRequest, GetDiscountResponse>, callBack: grpc.sendUnaryData<GetDiscountResponse>) {
    try {
        const data = call.request

        const row = await db.select().from(discounts).where(eq(discounts.id, data.id))
        if (row[0]) {
            return callBack(null, row[0])
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "discount not found",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `get discount error: ${error}`,
        })
    }
}

export async function listDiscounts(call: grpc.ServerUnaryCall<ListDiscountsRequest, ListDiscountsResponse>, callBack: grpc.sendUnaryData<ListDiscountsResponse>) {
    try {
        const rowList: GetDiscountResponse[] = await db
            .select()
            .from(discounts)
        if (rowList) {
            return callBack(null, {
                discounts: rowList
            })
        }
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `list discount error: ${error}`,
        })
    }
}

export async function updateDiscount(call: grpc.ServerUnaryCall<UpdateDiscountRequest, UpdateDiscountResponse>, callBack: grpc.sendUnaryData<UpdateDiscountResponse>) {
    try {
        const data = call.request
        const row = await db.select().from(discounts).where(eq(discounts.id, data.id))
        const result = await db
            .update(discounts)
            .set({
            name: data.name || row[0]?.name,
            amount: data.amount || row[0]?.amount,
            discountType: data.discountType || row[0]?.discountType,
            status: data.status || row[0]?.status,
            })
            .where(eq(discounts.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "discount updated" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "update discount error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `update discount error: ${error}`,
        })
    }
}

export async function deleteDiscount(call: grpc.ServerUnaryCall<DeleteDiscountRequest, DeleteDiscountResponse>, callBack: grpc.sendUnaryData<DeleteDiscountResponse>) {
    try {
        const data: DeleteDiscountRequest = call.request
        const result = await db
            .delete(discounts)
            .where(eq(discounts.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "discount deleted" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "delete discount error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `delete discount error: ${error}`,
        })
    }
}