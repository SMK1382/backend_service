import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path'
import { fileURLToPath } from "node:url";
import {
    type AddCarBrandRequest,
    type AddCarBrandResponse,
    type GetCarBrandRequest,
    type GetCarBrandResponse,
    type ListCarBrandsRequest,
    type ListCarBrandsResponse,
    type UpdateCarBrandRequest,
    type UpdateCarBrandResponse,
    type DeleteCarBrandRequest,
    type DeleteCarBrandResponse
} from './interfaces/carBrand.interface.js';
import db from '../db/index.js'
import { carBrands } from '../db/schema.js';
import {
    eq,
} from "drizzle-orm";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "carBrand.proto");

export const carBrandPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});



export async function addCarBrand(call: grpc.ServerUnaryCall<AddCarBrandRequest, AddCarBrandResponse>, callBack: grpc.sendUnaryData<AddCarBrandResponse>) {
    try {
        const data = call.request;
        const created = await db.insert(carBrands).values({
            name: data.name,
            slug: data.slug,
            country: data.country,
            description: data.description || null,
        })
        if (created) {
            return callBack(null, { statusMessage: "car brand added" });
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "add car brand error",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `add car brand error: ${error}`,
        })
    }
}

export async function getCarBrand(call: grpc.ServerUnaryCall<GetCarBrandRequest, GetCarBrandResponse>, callBack: grpc.sendUnaryData<GetCarBrandResponse>) {
    try {
        const data = call.request

        const row = await db.select().from(carBrands).where(eq(carBrands.id, data.id))
        if (row[0]) {
            return callBack(null, row[0])
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "car brand not found",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `get car brand error: ${error}`,
        })
    }
}

export async function listCarBrands(call: grpc.ServerUnaryCall<ListCarBrandsRequest, ListCarBrandsResponse>, callBack: grpc.sendUnaryData<ListCarBrandsResponse>) {
    try {
        const rowList: GetCarBrandResponse[] = await db
            .select()
            .from(carBrands)
        if (rowList) {
            return callBack(null, {
                carBrands: rowList
            })
        }
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `list car brand error: ${error}`,
        })
    }
}

export async function updateCarBrand(call: grpc.ServerUnaryCall<UpdateCarBrandRequest, UpdateCarBrandResponse>, callBack: grpc.sendUnaryData<UpdateCarBrandResponse>) {
    try {
        const data = call.request
        const row = await db.select().from(carBrands).where(eq(carBrands.id, data.id))
        const result = await db
            .update(carBrands)
            .set({
            name: data.name || row[0]?.name,
            slug: data.slug || row[0]?.slug,
            country: data.country || row[0]?.country,
            description: data.description || row[0]?.description,
            isActive: data.isActive || row[0]?.isActive,
            })
            .where(eq(carBrands.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "car brand updated" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "update car brand error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `update car brand error: ${error}`,
        })
    }
}

export async function deleteCarBrand(call: grpc.ServerUnaryCall<DeleteCarBrandRequest, DeleteCarBrandResponse>, callBack: grpc.sendUnaryData<DeleteCarBrandResponse>) {
    try {
        const data: DeleteCarBrandRequest = call.request
        const result = await db
            .delete(carBrands)
            .where(eq(carBrands.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "car brand deleted" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "delete car brand error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `delete car brand error: ${error}`,
        })
    }
}