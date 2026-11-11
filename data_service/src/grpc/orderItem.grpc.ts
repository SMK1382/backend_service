import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path'
import { fileURLToPath } from "node:url";
import {
    type AddOrderItemRequest,
    type AddOrderItemResponse,
    type GetOrderItemRequest,
    type GetOrderItemResponse,
    type ListOrderItemsRequest,
    type ListOrderItemsResponse,
    type UpdateOrderItemRequest,
    type UpdateOrderItemResponse,
    type DeleteOrderItemRequest,
    type DeleteOrderItemResponse
} from './interfaces/orderItem.interface.js';
import db from '../db/index.js'
import { orderItems } from '../db/schema.js';
import {
    eq,
} from "drizzle-orm";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "orderItem.proto");

export const orderItemPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});



export async function addOrderItem(call: grpc.ServerUnaryCall<AddOrderItemRequest, AddOrderItemResponse>, callBack: grpc.sendUnaryData<AddOrderItemResponse>) {
    try {
        const data = call.request;
        const created = await db.insert(orderItems).values({
            orderId: data.orderId,
            partId: data.partId,
            partName: data.partName,
            partNumber: data.partNumber || null,
            imageUrl: data.imageUrl || null,
            unitPrice: data.unitPrice,
        })
        if (created) {
            return callBack(null, { statusMessage: "order item added" });
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "add order item error",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `add order item error: ${error}`,
        })
    }
}

export async function getOrderItem(call: grpc.ServerUnaryCall<GetOrderItemRequest, GetOrderItemResponse>, callBack: grpc.sendUnaryData<GetOrderItemResponse>) {
    try {
        const data = call.request

        const row = await db.select().from(orderItems).where(eq(orderItems.id, data.id))
        if (row[0]) {
            return callBack(null, row[0])
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "order item not found",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `get order item error: ${error}`,
        })
    }
}

export async function listOrderItems(call: grpc.ServerUnaryCall<ListOrderItemsRequest, ListOrderItemsResponse>, callBack: grpc.sendUnaryData<ListOrderItemsResponse>) {
    try {
        const rowList: GetOrderItemResponse[] = await db
            .select()
            .from(orderItems)
        if (rowList) {
            return callBack(null, {
                orderItems: rowList
            })
        }
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `list order item error: ${error}`,
        })
    }
}

export async function updateOrderItem(call: grpc.ServerUnaryCall<UpdateOrderItemRequest, UpdateOrderItemResponse>, callBack: grpc.sendUnaryData<UpdateOrderItemResponse>) {
    try {
        const data = call.request
        const row = await db.select().from(orderItems).where(eq(orderItems.id, data.id))
        const result = await db
            .update(orderItems)
            .set({
            orderId: data.orderId || row[0]?.orderId,
            partId: data.partId || row[0]?.partId,
            partName: data.partName || row[0]?.partName,
            partNumber: data.partNumber || row[0]?.partNumber,
            imageUrl: data.imageUrl || row[0]?.imageUrl,
            quantity: data.quantity || row[0]?.quantity,
            unitPrice: data.unitPrice || row[0]?.unitPrice,
            })
            .where(eq(orderItems.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "order item updated" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "update order item error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `update order item error: ${error}`,
        })
    }
}

export async function deleteOrderItem(call: grpc.ServerUnaryCall<DeleteOrderItemRequest, DeleteOrderItemResponse>, callBack: grpc.sendUnaryData<DeleteOrderItemResponse>) {
    try {
        const data: DeleteOrderItemRequest = call.request
        const result = await db
            .delete(orderItems)
            .where(eq(orderItems.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "order item deleted" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "delete order item error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `delete order item error: ${error}`,
        })
    }
}