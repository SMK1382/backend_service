import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path'
import { fileURLToPath } from "node:url";
import {
    type AddSupplierRequest,
    type AddSupplierResponse,
    type GetSupplierRequest,
    type GetSupplierResponse,
    type ListSuppliersRequest,
    type ListSuppliersResponse,
    type UpdateSupplierRequest,
    type UpdateSupplierResponse,
    type DeleteSupplierRequest,
    type DeleteSupplierResponse
} from './interfaces/supplier.interface.js';
import db from '../db/index.js'
import { suppliers } from '../db/schema.js';
import {
    eq,
} from "drizzle-orm";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "supplier.proto");

export const supplierPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});



export async function addSupplier(call: grpc.ServerUnaryCall<AddSupplierRequest, AddSupplierResponse>, callBack: grpc.sendUnaryData<AddSupplierResponse>) {
    try {
        const data = call.request;
        const created = await db.insert(suppliers).values({
            supplierName: data.supplierName,
            supplierType: data.supplierType || undefined,
            contactPersonName: data.contactPersonName,
            nationalCode: data.nationalCode,
            phoneNumber: data.phoneNumber,
            bankAccountNumber: data.bankAccountNumber,
            score: data.score,
            status: data.status || undefined,
            description: data.description,
        })
        if (created) {
            return callBack(null, { statusMessage: "supplier added" });
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "add supplier error",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `add supplier error: ${error}`,
        })
    }
}

export async function getSupplier(call: grpc.ServerUnaryCall<GetSupplierRequest, GetSupplierResponse>, callBack: grpc.sendUnaryData<GetSupplierResponse>) {
    try {
        const data = call.request

        const row = await db.select().from(suppliers).where(eq(suppliers.id, data.id))
        if (row[0]) {
            return callBack(null, row[0])
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "supplier not found",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `get supplier error: ${error}`,
        })
    }
}

export async function listSuppliers(call: grpc.ServerUnaryCall<ListSuppliersRequest, ListSuppliersResponse>, callBack: grpc.sendUnaryData<ListSuppliersResponse>) {
    try {
        const rowList: GetSupplierResponse[] = await db
            .select()
            .from(suppliers)
        if (rowList) {
            return callBack(null, {
                suppliers: rowList
            })
        }
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `list supplier error: ${error}`,
        })
    }
}

export async function updateSupplier(call: grpc.ServerUnaryCall<UpdateSupplierRequest, UpdateSupplierResponse>, callBack: grpc.sendUnaryData<UpdateSupplierResponse>) {
    try {
        const data = call.request
        const row = await db.select().from(suppliers).where(eq(suppliers.id, data.id))
        const result = await db
            .update(suppliers)
            .set({
            supplierName: data.supplierName || row[0]?.supplierName,
            supplierType: data.supplierType || row[0]?.supplierType,
            contactPersonName: data.contactPersonName || row[0]?.contactPersonName,
            nationalCode: data.nationalCode || row[0]?.nationalCode,
            phoneNumber: data.phoneNumber || row[0]?.phoneNumber,
            bankAccountNumber: data.bankAccountNumber || row[0]?.bankAccountNumber,
            score: data.score || row[0]?.score,
            status: data.status || row[0]?.status,
            description: data.description || row[0]?.description,
            })
            .where(eq(suppliers.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "supplier updated" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "update supplier error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `update supplier error: ${error}`,
        })
    }
}

export async function deleteSupplier(call: grpc.ServerUnaryCall<DeleteSupplierRequest, DeleteSupplierResponse>, callBack: grpc.sendUnaryData<DeleteSupplierResponse>) {
    try {
        const data: DeleteSupplierRequest = call.request
        const result = await db
            .delete(suppliers)
            .where(eq(suppliers.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "supplier deleted" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "delete supplier error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `delete supplier error: ${error}`,
        })
    }
}