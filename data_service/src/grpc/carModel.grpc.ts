import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path'
import { fileURLToPath } from "node:url";
import {
    type AddCarModelRequest,
    type AddCarModelResponse,
    type GetCarModelRequest,
    type GetCarModelResponse,
    type ListCarModelsRequest,
    type ListCarModelsResponse,
    type UpdateCarModelRequest,
    type UpdateCarModelResponse,
    type DeleteCarModelRequest,
    type DeleteCarModelResponse
} from './interfaces/carModel.interface.js';
import db from '../db/index.js'
import { carModels } from '../db/schema.js';
import {
    eq,
} from "drizzle-orm";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "carModel.proto");

export const carModelPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});



export async function addCarModel(call: grpc.ServerUnaryCall<AddCarModelRequest, AddCarModelResponse>, callBack: grpc.sendUnaryData<AddCarModelResponse>) {
    try {
        const data = call.request;
        const created = await db.insert(carModels).values({
            nameFa: data.nameFa,
            nameEn: data.nameEn,
            brandId: data.brandId,
            yearOfManufacture: data.yearOfManufacture,
        })
        if (created) {
            return callBack(null, { statusMessage: "car model added" });
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "add car model error",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `add car model error: ${error}`,
        })
    }
}

export async function getCarModel(call: grpc.ServerUnaryCall<GetCarModelRequest, GetCarModelResponse>, callBack: grpc.sendUnaryData<GetCarModelResponse>) {
    try {
        const data = call.request

        const row = await db.select().from(carModels).where(eq(carModels.id, data.id))
        if (row[0]) {
            return callBack(null, row[0])
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "car model not found",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `get car model error: ${error}`,
        })
    }
}

export async function listCarModels(call: grpc.ServerUnaryCall<ListCarModelsRequest, ListCarModelsResponse>, callBack: grpc.sendUnaryData<ListCarModelsResponse>) {
    try {
        const rowList: GetCarModelResponse[] = await db
            .select()
            .from(carModels)
        if (rowList) {
            return callBack(null, {
                carModels: rowList
            })
        }
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `list car model error: ${error}`,
        })
    }
}

export async function updateCarModel(call: grpc.ServerUnaryCall<UpdateCarModelRequest, UpdateCarModelResponse>, callBack: grpc.sendUnaryData<UpdateCarModelResponse>) {
    try {
        const data = call.request
        const row = await db.select().from(carModels).where(eq(carModels.id, data.id))
        const result = await db
            .update(carModels)
            .set({
            nameFa: data.nameFa || row[0]?.nameFa,
            nameEn: data.nameEn || row[0]?.nameEn,
            brandId: data.brandId || row[0]?.brandId,
            yearOfManufacture: data.yearOfManufacture || row[0]?.yearOfManufacture,
            })
            .where(eq(carModels.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "car model updated" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "update car model error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `update car model error: ${error}`,
        })
    }
}

export async function deleteCarModel(call: grpc.ServerUnaryCall<DeleteCarModelRequest, DeleteCarModelResponse>, callBack: grpc.sendUnaryData<DeleteCarModelResponse>) {
    try {
        const data: DeleteCarModelRequest = call.request
        const result = await db
            .delete(carModels)
            .where(eq(carModels.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "car model deleted" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "delete car model error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `delete car model error: ${error}`,
        })
    }
}