import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path'
import { fileURLToPath } from "node:url";
import {
    type AddShoppingCartRequest,
    type AddShoppingCartResponse,
    type GetShoppingCartRequest,
    type GetShoppingCartResponse,
    type ListShoppingCartRequest,
    type ListShoppingCartResponse,
    type UpdateShoppingCartRequest,
    type UpdateShoppingCartResponse,
    type DeleteShoppingCartRequest,
    type DeleteShoppingCartResponse
} from './interfaces/shoppingCart.interface.js';
import db from '../db/index.js'
import { shoppingCart } from '../db/schema.js';
import {
    eq,
} from "drizzle-orm";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "shoppingCart.proto");

export const shoppingCartPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});



export async function addShoppingCart(call: grpc.ServerUnaryCall<AddShoppingCartRequest, AddShoppingCartResponse>, callBack: grpc.sendUnaryData<AddShoppingCartResponse>) {
    try {
        const data = call.request;
        const created = await db.insert(shoppingCart).values({
            userId: data.userId,
            partId: data.partId,
        })
        if (created) {
            return callBack(null, { statusMessage: "shopping cart added" });
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "add shopping cart error",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `add shopping cart error: ${error}`,
        })
    }
}

export async function getShoppingCart(call: grpc.ServerUnaryCall<GetShoppingCartRequest, GetShoppingCartResponse>, callBack: grpc.sendUnaryData<GetShoppingCartResponse>) {
    try {
        const data = call.request

        const row = await db.select().from(shoppingCart).where(eq(shoppingCart.id, data.id))
        if (row[0]) {
            return callBack(null, row[0])
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "shopping cart not found",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `get shopping cart error: ${error}`,
        })
    }
}

export async function listShoppingCart(call: grpc.ServerUnaryCall<ListShoppingCartRequest, ListShoppingCartResponse>, callBack: grpc.sendUnaryData<ListShoppingCartResponse>) {
    try {
        const rowList: GetShoppingCartResponse[] = await db
            .select()
            .from(shoppingCart)
        if (rowList) {
            return callBack(null, {
                shoppingCart: rowList
            })
        }
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `list shopping cart error: ${error}`,
        })
    }
}

export async function updateShoppingCart(call: grpc.ServerUnaryCall<UpdateShoppingCartRequest, UpdateShoppingCartResponse>, callBack: grpc.sendUnaryData<UpdateShoppingCartResponse>) {
    try {
        const data = call.request
        const row = await db.select().from(shoppingCart).where(eq(shoppingCart.id, data.id))
        const result = await db
            .update(shoppingCart)
            .set({
            userId: data.userId || row[0]?.userId,
            partId: data.partId || row[0]?.partId,
            quantity: data.quantity || row[0]?.quantity,
            })
            .where(eq(shoppingCart.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "shopping cart updated" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "update shopping cart error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `update shopping cart error: ${error}`,
        })
    }
}

export async function deleteShoppingCart(call: grpc.ServerUnaryCall<DeleteShoppingCartRequest, DeleteShoppingCartResponse>, callBack: grpc.sendUnaryData<DeleteShoppingCartResponse>) {
    try {
        const data: DeleteShoppingCartRequest = call.request
        const result = await db
            .delete(shoppingCart)
            .where(eq(shoppingCart.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "shopping cart deleted" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "delete shopping cart error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `delete shopping cart error: ${error}`,
        })
    }
}