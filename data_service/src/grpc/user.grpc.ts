import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path'
import { fileURLToPath } from "node:url";
import {
    type AddUserRequest,
    type AddUserResponse,
    type GetUserRequest,
    type GetUserResponse,
    type ListUsersRequest,
    type ListUsersResponse,
    type UpdateUserRequest,
    type UpdateUserResponse,
    type DeleteUserRequest,
    type DeleteUserResponse
} from './interfaces/user.interface.js';
import db from '../db/index.js'
import { users } from '../db/schema.js';
import {
    eq,
    // ne,
    // gt,
    // gte,
    // lt,
    // lte,
    // like,
    // ilike,
    // and,
    // or,
    // inArray,
    // isNull,
    // isNotNull,
} from "drizzle-orm";


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
    const created = await db.insert(users).values(user)
    if (user) {
        return callBack(null, { statusMessage: "register complate" });
    }
    return callBack({
        code: grpc.status.NOT_FOUND,
        message: "add user error",
    })
}

export async function getUser(call: grpc.ServerUnaryCall<GetUserRequest, GetUserResponse>, callBack: grpc.sendUnaryData<GetUserResponse>) {
    const phone = call.request

    const user: GetUserResponse[] = await db.select().from(users).where(eq(users.phone, phone.phone))
    // console.log(user)
    if (user) {
        return callBack(null, user[0])
    }
    return callBack({
        code: grpc.status.NOT_FOUND,
        message: "User not found",
    })
}

export async function ListUsers(call: grpc.ServerUnaryCall<ListUsersRequest, ListUsersResponse>, callBack: grpc.sendUnaryData<ListUsersResponse>) {
    const userList : GetUserResponse[]= await db
        .select()
        .from(users)
    if (userList) {
        return callBack(null, {
            users: userList
        })
    }
}
export async function updateUser(call: grpc.ServerUnaryCall<UpdateUserRequest, UpdateUserResponse>, callBack: grpc.sendUnaryData<UpdateUserResponse>) {
    const data = call.request
    const user: Array<GetUserResponse> = await db.select().from(users).where(eq(users.phone, data.phone))
    const result = await db
        .update(users)
        .set({
            firstName: data.firstName || user[0]?.firstName,
            lastName: data.lastName || user[0]?.lastName,
            email: data.email || user[0]?.email,
            status: data.status || user[0]?.status,
            role: data.role || user[0]?.role
        })
        .where(eq(users.phone, data.phone));
    if (result) {
        return callBack(null, { statusMessage: "user updated" })
    }
    return callBack({
        code: grpc.status.NOT_FOUND,
        message: "update user error!!!",
    })
}

export async function deleteUser(call: grpc.ServerUnaryCall<DeleteUserRequest, DeleteUserResponse>, callBack: grpc.sendUnaryData<DeleteUserResponse>) {
    const data : DeleteUserRequest = call.request
    const result = await db
  .delete(users)
  .where(eq(users.phone, data.phone));
  console.log(result)
    if (result) {
        return callBack(null, { statusMessage: "user deleted" })
    }
    return callBack({
        code: grpc.status.NOT_FOUND,
        message: "update user error!!!",
    })
}