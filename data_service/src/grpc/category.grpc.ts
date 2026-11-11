import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path'
import { fileURLToPath } from "node:url";
import {
    type AddCategoryRequest,
    type AddCategoryResponse,
    type GetCategoryRequest,
    type GetCategoryResponse,
    type ListCategoriesRequest,
    type ListCategoriesResponse,
    type UpdateCategoryRequest,
    type UpdateCategoryResponse,
    type DeleteCategoryRequest,
    type DeleteCategoryResponse
} from './interfaces/category.interface.js';
import db from '../db/index.js'
import { categories } from '../db/schema.js';
import {
    eq,
} from "drizzle-orm";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "category.proto");

export const categoryPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});



export async function addCategory(call: grpc.ServerUnaryCall<AddCategoryRequest, AddCategoryResponse>, callBack: grpc.sendUnaryData<AddCategoryResponse>) {
    try {
        const data = call.request;
        const created = await db.insert(categories).values({
            name: data.name,
            slug: data.slug,
            parentId: data.parentId || null,
        })
        if (created) {
            return callBack(null, { statusMessage: "category added" });
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "add category error",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `add category error: ${error}`,
        })
    }
}

export async function getCategory(call: grpc.ServerUnaryCall<GetCategoryRequest, GetCategoryResponse>, callBack: grpc.sendUnaryData<GetCategoryResponse>) {
    try {
        const data = call.request

        const row = await db.select().from(categories).where(eq(categories.id, data.id))
        if (row[0]) {
            return callBack(null, row[0])
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "category not found",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `get category error: ${error}`,
        })
    }
}

export async function listCategories(call: grpc.ServerUnaryCall<ListCategoriesRequest, ListCategoriesResponse>, callBack: grpc.sendUnaryData<ListCategoriesResponse>) {
    try {
        const rowList: GetCategoryResponse[] = await db
            .select()
            .from(categories)
        if (rowList) {
            return callBack(null, {
                categories: rowList
            })
        }
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `list category error: ${error}`,
        })
    }
}

export async function updateCategory(call: grpc.ServerUnaryCall<UpdateCategoryRequest, UpdateCategoryResponse>, callBack: grpc.sendUnaryData<UpdateCategoryResponse>) {
    try {
        const data = call.request
        const row = await db.select().from(categories).where(eq(categories.id, data.id))
        const result = await db
            .update(categories)
            .set({
            name: data.name || row[0]?.name,
            slug: data.slug || row[0]?.slug,
            parentId: data.parentId || row[0]?.parentId,
            sortOrder: data.sortOrder || row[0]?.sortOrder,
            isActive: data.isActive || row[0]?.isActive,
            })
            .where(eq(categories.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "category updated" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "update category error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `update category error: ${error}`,
        })
    }
}

export async function deleteCategory(call: grpc.ServerUnaryCall<DeleteCategoryRequest, DeleteCategoryResponse>, callBack: grpc.sendUnaryData<DeleteCategoryResponse>) {
    try {
        const data: DeleteCategoryRequest = call.request
        const result = await db
            .delete(categories)
            .where(eq(categories.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "category deleted" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "delete category error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `delete category error: ${error}`,
        })
    }
}