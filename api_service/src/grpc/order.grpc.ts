import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path';
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "order.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const orderProto = grpc.loadPackageDefinition(packageDefinition) as any;

export interface AddOrderResponse {
  statusMessage: string,
}

export interface GetOrderResponse {
  id: number,
  userId: number,
  status: string,
  paymentMethod: string,
  paymentStatus: string,
  receiverName: string,
  receiverPhone: string,
  province: string,
  city: string,
  postalCode: string,
  addressLine: string,
  note: string,
  itemsSubtotal: number,
  discountAmount: number,
  shippingCost: number,
  totalAmount: number,
  trackingCode: string,
}

export interface ListOrdersResponse {
  orders: GetOrderResponse[]
}

export interface UpdateOrderResponse {
  statusMessage: string
}

export interface DeleteOrderResponse {
  statusMessage: string
}

const client = new orderProto.order.OrderService(
  `127.0.0.1:${process.env.GRPCPORT}`,
  grpc.credentials.createInsecure(),
);

export default client