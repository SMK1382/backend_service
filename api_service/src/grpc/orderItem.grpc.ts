import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path';
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "orderItem.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const orderItemProto = grpc.loadPackageDefinition(packageDefinition) as any;

export interface AddOrderItemResponse {
  statusMessage: string,
}

export interface GetOrderItemResponse {
  id: number,
  orderId: number,
  partId: number,
  partName: string,
  partNumber: string,
  imageUrl: string,
  quantity: number,
  unitPrice: number,
}

export interface ListOrderItemsResponse {
  orderItems: GetOrderItemResponse[]
}

export interface UpdateOrderItemResponse {
  statusMessage: string
}

export interface DeleteOrderItemResponse {
  statusMessage: string
}

const client = new orderItemProto.orderItem.OrderItemService(
  `127.0.0.1:${process.env.GRPCPORT}`,
  grpc.credentials.createInsecure(),
);

export default client