import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path';
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "supplier.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const supplierProto = grpc.loadPackageDefinition(packageDefinition) as any;

export interface AddSupplierResponse {
  statusMessage: string,
}

export interface GetSupplierResponse {
  id: number,
  supplierName: string,
  supplierType: string,
  contactPersonName: string,
  nationalCode: string,
  phoneNumber: string,
  bankAccountNumber: string,
  score: number,
  status: string,
  description: string,
}

export interface ListSuppliersResponse {
  suppliers: GetSupplierResponse[]
}

export interface UpdateSupplierResponse {
  statusMessage: string
}

export interface DeleteSupplierResponse {
  statusMessage: string
}

const client = new supplierProto.supplier.SupplierService(
  `127.0.0.1:${process.env.GRPCPORT}`,
  grpc.credentials.createInsecure(),
);

export default client