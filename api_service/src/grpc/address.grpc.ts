import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path';
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "address.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const addressProto = grpc.loadPackageDefinition(packageDefinition) as any;

export interface AddAddressResponse {
  statusMessage: string,
}

export interface GetAddressResponse {
  id: number,
  userId: number,
  receiverName: string,
  receiverPhone: string,
  province: string,
  city: string,
  postalCode: string,
  line: string,
  isDefault: boolean,
}

export interface ListAddressesResponse {
  addresses: GetAddressResponse[]
}

export interface UpdateAddressResponse {
  statusMessage: string
}

export interface DeleteAddressResponse {
  statusMessage: string
}

const client = new addressProto.address.AddressService(
  `127.0.0.1:${process.env.GRPCPORT}`,
  grpc.credentials.createInsecure(),
);

export default client