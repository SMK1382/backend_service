import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path';
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "partCompatibility.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const partCompatibilityProto = grpc.loadPackageDefinition(packageDefinition) as any;

export interface AddPartCompatibilityResponse {
  statusMessage: string,
}

export interface GetPartCompatibilityResponse {
  id: number,
  partId: number,
  carModelId: number,
  yearsNote: string,
}

export interface ListPartCompatibilitiesResponse {
  partCompatibilities: GetPartCompatibilityResponse[]
}

export interface UpdatePartCompatibilityResponse {
  statusMessage: string
}

export interface DeletePartCompatibilityResponse {
  statusMessage: string
}

const client = new partCompatibilityProto.partCompatibility.PartCompatibilityService(
  `127.0.0.1:${process.env.GRPCPORT}`,
  grpc.credentials.createInsecure(),
);

export default client