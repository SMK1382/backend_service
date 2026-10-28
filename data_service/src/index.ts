import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path'
import { fileURLToPath } from "node:url";
import db from './db/index.js'
import { users } from './db/schema.js'
import { z } from 'zod'

// console.log(db)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "grpc_data_api.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition).user as any;

interface AddUserRequest {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    nationalCode: string,
    password: string
}

interface AddUserResponse {
    statusMessage: string,
}

interface GetUserRequest {
    phone: string,
    password: string
}

interface GetUserResponse {
    isRegister: boolean
}


function addUser(call: grpc.ServerUnaryCall<AddUserRequest, AddUserResponse>, callBack: grpc.sendUnaryData<AddUserResponse>): void {
    const user = call.request;
    // console.log(user)
    return callBack(null, { statusMessage: "data recieve" });
}

function getUser(call: grpc.ServerUnaryCall<GetUserRequest, GetUserResponse>, callBack: grpc.sendUnaryData<GetUserResponse>): void {
    const user = call.request
    return callBack(null, { isRegister: true })
}



const server = new grpc.Server();

server.addService(proto.UserService.service, {
    AddUser: addUser,
    GetUser: getUser
});

server.bindAsync(
    `127.0.0.1:${process.env.PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
        if (error) {
            console.error("Server error:", error);
            return;
        }
        console.log(`gRPC server listening on ${port}`);
    }
);