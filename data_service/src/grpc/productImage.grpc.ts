import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path'
import { fileURLToPath } from "node:url";
import {
    type AddProductImageRequest,
    type AddProductImageResponse,
    type GetProductImageRequest,
    type GetProductImageResponse,
    type ListProductImagesRequest,
    type ListProductImagesResponse,
    type UpdateProductImageRequest,
    type UpdateProductImageResponse,
    type DeleteProductImageRequest,
    type DeleteProductImageResponse
} from './interfaces/productImage.interface.js';
import db from '../db/index.js'
import { productImages } from '../db/schema.js';
import {
    eq,
} from "drizzle-orm";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "productImage.proto");

export const productImagePackageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});



export async function addProductImage(call: grpc.ServerUnaryCall<AddProductImageRequest, AddProductImageResponse>, callBack: grpc.sendUnaryData<AddProductImageResponse>) {
    try {
        const data = call.request;
        const created = await db.insert(productImages).values({
            partId: data.partId,
            url: data.url,
            alt: data.alt || null,
        })
        if (created) {
            return callBack(null, { statusMessage: "product image added" });
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "add product image error",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `add product image error: ${error}`,
        })
    }
}

export async function getProductImage(call: grpc.ServerUnaryCall<GetProductImageRequest, GetProductImageResponse>, callBack: grpc.sendUnaryData<GetProductImageResponse>) {
    try {
        const data = call.request

        const row = await db.select().from(productImages).where(eq(productImages.id, data.id))
        if (row[0]) {
            return callBack(null, row[0])
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "product image not found",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `get product image error: ${error}`,
        })
    }
}

export async function listProductImages(call: grpc.ServerUnaryCall<ListProductImagesRequest, ListProductImagesResponse>, callBack: grpc.sendUnaryData<ListProductImagesResponse>) {
    try {
        const rowList: GetProductImageResponse[] = await db
            .select()
            .from(productImages)
        if (rowList) {
            return callBack(null, {
                productImages: rowList
            })
        }
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `list product image error: ${error}`,
        })
    }
}

export async function updateProductImage(call: grpc.ServerUnaryCall<UpdateProductImageRequest, UpdateProductImageResponse>, callBack: grpc.sendUnaryData<UpdateProductImageResponse>) {
    try {
        const data = call.request
        const row = await db.select().from(productImages).where(eq(productImages.id, data.id))
        const result = await db
            .update(productImages)
            .set({
            partId: data.partId || row[0]?.partId,
            url: data.url || row[0]?.url,
            alt: data.alt || row[0]?.alt,
            sortOrder: data.sortOrder || row[0]?.sortOrder,
            })
            .where(eq(productImages.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "product image updated" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "update product image error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `update product image error: ${error}`,
        })
    }
}

export async function deleteProductImage(call: grpc.ServerUnaryCall<DeleteProductImageRequest, DeleteProductImageResponse>, callBack: grpc.sendUnaryData<DeleteProductImageResponse>) {
    try {
        const data: DeleteProductImageRequest = call.request
        const result = await db
            .delete(productImages)
            .where(eq(productImages.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "product image deleted" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "delete product image error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `delete product image error: ${error}`,
        })
    }
}