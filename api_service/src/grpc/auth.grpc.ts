import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path';
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "grpc_data_api.proto");
// console.log(PROTO_PATH)

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition).user as any;

export interface AddUserResponse {
    statusMessage: string,
}

export interface GetUserResponse {
    isRegister: boolean
}

const client = new proto.UserService(
    `127.0.0.1:${process.env.GRPCPORT}`,
    grpc.credentials.createInsecure(),
);

export default client