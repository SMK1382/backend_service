import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path';
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "wishlist.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const wishlistProto = grpc.loadPackageDefinition(packageDefinition) as any;

export interface AddWishlistResponse {
  statusMessage: string,
}

export interface GetWishlistResponse {
  id: number,
  userId: number,
  partId: number,
}

export interface ListWishlistResponse {
  wishlist: GetWishlistResponse[]
}

export interface UpdateWishlistResponse {
  statusMessage: string
}

export interface DeleteWishlistResponse {
  statusMessage: string
}

const client = new wishlistProto.wishlist.WishlistService(
  `127.0.0.1:${process.env.GRPCPORT}`,
  grpc.credentials.createInsecure(),
);

export default client