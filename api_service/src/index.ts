import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path'
import { fileURLToPath } from "node:url";

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

interface AddUserResponse {
    statusMessage: string,
}

const client = new proto.UserService(
    `127.0.0.1:${process.env.PORT}`,
    grpc.credentials.createInsecure(),
);


client.AddUser({
    firstName: "Mohammadreza",
    lastName: "Kalali",
    email: "test@gmail.com",
    phone: "09919703664",
    nationalCode: "0926715178",
    password: "12345678"
}, (error: grpc.ServiceError | null,
    response: AddUserResponse) => {
    console.log(response)
})
// دریافت یک کاربر
// client.GetUser({ id: 1 }, (error, response) => {
//     if (error) {
//         console.error("GetUser error:", error.message);
//         return;
//     }

//     console.log("User:", response);
// });

// // دریافت فهرست کاربران
// client.ListUsers({}, (error, response) => {
//     if (error) {
//         console.error("ListUsers error:", error.message);
//         return;
//     }

// console.log("Users:", response.users);
// });