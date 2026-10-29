import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path'
import { fileURLToPath } from "node:url";
import { type GetUserRequest, type GetUserResponse, type AddUserRequest, type AddUserResponse, type UpdateUserRequest, type UpdateUserResponse, type DeleteUserRequest, type DeleteUserResponse } from './interfaces/user.interface.js';
import db from '../db/index.js'
import { users } from '../db/schema.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "user.proto");

export const userPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});



export async function addUser(call: grpc.ServerUnaryCall<AddUserRequest, AddUserResponse>, callBack: grpc.sendUnaryData<AddUserResponse>) {
    const user = call.request;
    if (user) {
        const x = await db.insert(users).values(user)
        console.log(x)
        return callBack(null, { statusMessage: "data recieve" });
    }
    return callBack({
        code: grpc.status.NOT_FOUND,
        message: "add user error",
    })
}

export function getUser(call: grpc.ServerUnaryCall<GetUserRequest, GetUserResponse>, callBack: grpc.sendUnaryData<GetUserResponse>) {
    console.log("updateUser")
    const phone = call.request
    if (phone) {
        return callBack(null, { isRegister: true })
    }
    return callBack({
        code: grpc.status.NOT_FOUND,
        message: "User not found",
    })
}

export function updateUser(call: grpc.ServerUnaryCall<UpdateUserRequest, UpdateUserResponse>, callBack: grpc.sendUnaryData<UpdateUserResponse>) {
    const phone = call.request
    if (phone) {
        return callBack(null, { statusMessage: "user updated" })
    }
    return callBack({
        code: grpc.status.NOT_FOUND,
        message: "update user error!!!",
    })
}

export function deleteUser(call: grpc.ServerUnaryCall<DeleteUserRequest, DeleteUserResponse>, callBack: grpc.sendUnaryData<DeleteUserResponse>) {
    const phone = call.request
    if (phone) {
        return callBack(null, { statusMessage: "user deleted" })
    }
    return callBack({
        code: grpc.status.NOT_FOUND,
        message: "update user error!!!",
    })
}