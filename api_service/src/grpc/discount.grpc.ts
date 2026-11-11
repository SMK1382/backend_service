import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path';
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "discount.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const discountProto = grpc.loadPackageDefinition(packageDefinition) as any;

export interface AddDiscountResponse {
  statusMessage: string,
}

export interface GetDiscountResponse {
  id: number,
  name: string,
  amount: number,
  discountType: string,
  status: string,
}

export interface ListDiscountsResponse {
  discounts: GetDiscountResponse[]
}

export interface UpdateDiscountResponse {
  statusMessage: string
}

export interface DeleteDiscountResponse {
  statusMessage: string
}

const client = new discountProto.discount.DiscountService(
  `127.0.0.1:${process.env.GRPCPORT}`,
  grpc.credentials.createInsecure(),
);

export default client