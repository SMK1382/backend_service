import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path';
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "returnRequest.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const returnRequestProto = grpc.loadPackageDefinition(packageDefinition) as any;

export interface AddReturnRequestResponse {
  statusMessage: string,
}

export interface GetReturnRequestResponse {
  id: number,
  orderId: number,
  userId: number,
  reasonDescription: string,
  status: string,
}

export interface ListReturnRequestsResponse {
  returnRequests: GetReturnRequestResponse[]
}

export interface UpdateReturnRequestResponse {
  statusMessage: string
}

export interface DeleteReturnRequestResponse {
  statusMessage: string
}

const client = new returnRequestProto.returnRequest.ReturnRequestService(
  `127.0.0.1:${process.env.GRPCPORT}`,
  grpc.credentials.createInsecure(),
);

export default client