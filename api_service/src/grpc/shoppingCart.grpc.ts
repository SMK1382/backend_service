import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path';
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "shoppingCart.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const shoppingCartProto = grpc.loadPackageDefinition(packageDefinition) as any;

export interface AddShoppingCartResponse {
  statusMessage: string,
}

export interface GetShoppingCartResponse {
  id: number,
  userId: number,
  partId: number,
  quantity: number,
}

export interface ListShoppingCartResponse {
  shoppingCart: GetShoppingCartResponse[]
}

export interface UpdateShoppingCartResponse {
  statusMessage: string
}

export interface DeleteShoppingCartResponse {
  statusMessage: string
}

const client = new shoppingCartProto.shoppingCart.ShoppingCartService(
  `127.0.0.1:${process.env.GRPCPORT}`,
  grpc.credentials.createInsecure(),
);

export default client