import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path'
import { fileURLToPath } from "node:url";
import {
    type AddWishlistRequest,
    type AddWishlistResponse,
    type GetWishlistRequest,
    type GetWishlistResponse,
    type ListWishlistRequest,
    type ListWishlistResponse,
    type UpdateWishlistRequest,
    type UpdateWishlistResponse,
    type DeleteWishlistRequest,
    type DeleteWishlistResponse
} from './interfaces/wishlist.interface.js';
import db from '../db/index.js'
import { wishlist } from '../db/schema.js';
import {
    eq,
} from "drizzle-orm";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "wishlist.proto");

export const wishlistPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});



export async function addWishlist(call: grpc.ServerUnaryCall<AddWishlistRequest, AddWishlistResponse>, callBack: grpc.sendUnaryData<AddWishlistResponse>) {
    try {
        const data = call.request;
        const created = await db.insert(wishlist).values({
            userId: data.userId,
            partId: data.partId,
        })
        if (created) {
            return callBack(null, { statusMessage: "wishlist added" });
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "add wishlist error",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `add wishlist error: ${error}`,
        })
    }
}

export async function getWishlist(call: grpc.ServerUnaryCall<GetWishlistRequest, GetWishlistResponse>, callBack: grpc.sendUnaryData<GetWishlistResponse>) {
    try {
        const data = call.request

        const row = await db.select().from(wishlist).where(eq(wishlist.id, data.id))
        if (row[0]) {
            return callBack(null, row[0])
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "wishlist not found",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `get wishlist error: ${error}`,
        })
    }
}

export async function listWishlist(call: grpc.ServerUnaryCall<ListWishlistRequest, ListWishlistResponse>, callBack: grpc.sendUnaryData<ListWishlistResponse>) {
    try {
        const rowList: GetWishlistResponse[] = await db
            .select()
            .from(wishlist)
        if (rowList) {
            return callBack(null, {
                wishlist: rowList
            })
        }
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `list wishlist error: ${error}`,
        })
    }
}

export async function updateWishlist(call: grpc.ServerUnaryCall<UpdateWishlistRequest, UpdateWishlistResponse>, callBack: grpc.sendUnaryData<UpdateWishlistResponse>) {
    try {
        const data = call.request
        const row = await db.select().from(wishlist).where(eq(wishlist.id, data.id))
        const result = await db
            .update(wishlist)
            .set({
            userId: data.userId || row[0]?.userId,
            partId: data.partId || row[0]?.partId,
            })
            .where(eq(wishlist.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "wishlist updated" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "update wishlist error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `update wishlist error: ${error}`,
        })
    }
}

export async function deleteWishlist(call: grpc.ServerUnaryCall<DeleteWishlistRequest, DeleteWishlistResponse>, callBack: grpc.sendUnaryData<DeleteWishlistResponse>) {
    try {
        const data: DeleteWishlistRequest = call.request
        const result = await db
            .delete(wishlist)
            .where(eq(wishlist.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "wishlist deleted" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "delete wishlist error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `delete wishlist error: ${error}`,
        })
    }
}