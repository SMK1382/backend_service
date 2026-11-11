import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path';
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "productImage.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const productImageProto = grpc.loadPackageDefinition(packageDefinition) as any;

export interface AddProductImageResponse {
  statusMessage: string,
}

export interface GetProductImageResponse {
  id: number,
  partId: number,
  url: string,
  alt: string,
  sortOrder: number,
}

export interface ListProductImagesResponse {
  productImages: GetProductImageResponse[]
}

export interface UpdateProductImageResponse {
  statusMessage: string
}

export interface DeleteProductImageResponse {
  statusMessage: string
}

const client = new productImageProto.productImage.ProductImageService(
  `127.0.0.1:${process.env.GRPCPORT}`,
  grpc.credentials.createInsecure(),
);

export default client