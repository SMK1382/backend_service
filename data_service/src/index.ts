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

interface User {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    nationalCode: string,
    password: string
}


function addUser(call: grpc.ServerUnaryCall<AddUserRequest, AddUserResponse>, callBack: grpc.sendUnaryData<AddUserResponse>): void {
    const user = call.request;
    const schema = z.object({
        firstName: z.string().min(2, 'نام باید حداقل ۲ حرف باشد').max(60),
        lastName: z.string().min(2, 'نام خانوادگی باید حداقل ۲ حرف باشد').max(60),
        email: z.string().email('ایمیل معتبر نیست').max(150),
        phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد'),
        password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد').max(100),
        role: z.enum(['Super_Admin', 'Super', 'User']).default('User'),
    })
    const parsed = schema.safeParse(user)
    console.log(parsed)
    if (!parsed.success) {
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "User not found",
        });
    }
    return callBack(null, { statusMessage: "data recieve" });
    // const { password, ...values } = parsed.data

}



const server = new grpc.Server();

server.addService(proto.UserService.service, {
    AddUser: addUser,
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