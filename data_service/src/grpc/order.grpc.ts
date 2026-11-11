import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path'
import { fileURLToPath } from "node:url";
import {
    type AddOrderRequest,
    type AddOrderResponse,
    type GetOrderRequest,
    type GetOrderResponse,
    type ListOrdersRequest,
    type ListOrdersResponse,
    type UpdateOrderRequest,
    type UpdateOrderResponse,
    type DeleteOrderRequest,
    type DeleteOrderResponse
} from './interfaces/order.interface.js';
import db from '../db/index.js'
import { orders } from '../db/schema.js';
import {
    eq,
} from "drizzle-orm";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "order.proto");

export const orderPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});



export async function addOrder(call: grpc.ServerUnaryCall<AddOrderRequest, AddOrderResponse>, callBack: grpc.sendUnaryData<AddOrderResponse>) {
    try {
        const data = call.request;
        const created = await db.insert(orders).values({
            userId: data.userId,
            status: data.status || undefined,
            paymentMethod: data.paymentMethod || undefined,
            paymentStatus: data.paymentStatus || undefined,
            receiverName: data.receiverName,
            receiverPhone: data.receiverPhone,
            province: data.province,
            city: data.city,
            postalCode: data.postalCode,
            addressLine: data.addressLine,
            note: data.note || null,
            itemsSubtotal: data.itemsSubtotal,
            discountAmount: data.discountAmount,
            shippingCost: data.shippingCost,
            totalAmount: data.totalAmount,
            trackingCode: data.trackingCode || null,
        })
        if (created) {
            return callBack(null, { statusMessage: "order added" });
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "add order error",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `add order error: ${error}`,
        })
    }
}

export async function getOrder(call: grpc.ServerUnaryCall<GetOrderRequest, GetOrderResponse>, callBack: grpc.sendUnaryData<GetOrderResponse>) {
    try {
        const data = call.request

        const row = await db.select().from(orders).where(eq(orders.id, data.id))
        if (row[0]) {
            return callBack(null, row[0])
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "order not found",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `get order error: ${error}`,
        })
    }
}

export async function listOrders(call: grpc.ServerUnaryCall<ListOrdersRequest, ListOrdersResponse>, callBack: grpc.sendUnaryData<ListOrdersResponse>) {
    try {
        const rowList: GetOrderResponse[] = await db
            .select()
            .from(orders)
        if (rowList) {
            return callBack(null, {
                orders: rowList
            })
        }
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `list order error: ${error}`,
        })
    }
}

export async function updateOrder(call: grpc.ServerUnaryCall<UpdateOrderRequest, UpdateOrderResponse>, callBack: grpc.sendUnaryData<UpdateOrderResponse>) {
    try {
        const data = call.request
        const row = await db.select().from(orders).where(eq(orders.id, data.id))
        const result = await db
            .update(orders)
            .set({
            userId: data.userId || row[0]?.userId,
            status: data.status || row[0]?.status,
            paymentMethod: data.paymentMethod || row[0]?.paymentMethod,
            paymentStatus: data.paymentStatus || row[0]?.paymentStatus,
            receiverName: data.receiverName || row[0]?.receiverName,
            receiverPhone: data.receiverPhone || row[0]?.receiverPhone,
            province: data.province || row[0]?.province,
            city: data.city || row[0]?.city,
            postalCode: data.postalCode || row[0]?.postalCode,
            addressLine: data.addressLine || row[0]?.addressLine,
            note: data.note || row[0]?.note,
            itemsSubtotal: data.itemsSubtotal || row[0]?.itemsSubtotal,
            discountAmount: data.discountAmount || row[0]?.discountAmount,
            shippingCost: data.shippingCost || row[0]?.shippingCost,
            totalAmount: data.totalAmount || row[0]?.totalAmount,
            trackingCode: data.trackingCode || row[0]?.trackingCode,
            })
            .where(eq(orders.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "order updated" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "update order error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `update order error: ${error}`,
        })
    }
}

export async function deleteOrder(call: grpc.ServerUnaryCall<DeleteOrderRequest, DeleteOrderResponse>, callBack: grpc.sendUnaryData<DeleteOrderResponse>) {
    try {
        const data: DeleteOrderRequest = call.request
        const result = await db
            .delete(orders)
            .where(eq(orders.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "order deleted" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "delete order error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `delete order error: ${error}`,
        })
    }
}