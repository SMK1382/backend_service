import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path';
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "part.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const partProto = grpc.loadPackageDefinition(packageDefinition) as any;

export interface AddPartResponse {
  statusMessage: string,
}

export interface GetPartResponse {
  id: number,
  name: string,
  slug: string,
  brandId: number,
  description: string,
  price: number,
  discountAmount: number,
  stock: number,
  partNumber: string,
  weightGrams: number,
  supplierId: number,
  unit: string,
  categoryId: number,
  status: string,
  isFeatured: boolean,
  metaTitle: string,
  metaDescription: string,
}

export interface ListPartsResponse {
  parts: GetPartResponse[]
}

export interface UpdatePartResponse {
  statusMessage: string
}

export interface DeletePartResponse {
  statusMessage: string
}

const client = new partProto.part.PartService(
  `127.0.0.1:${process.env.GRPCPORT}`,
  grpc.credentials.createInsecure(),
);

export default client