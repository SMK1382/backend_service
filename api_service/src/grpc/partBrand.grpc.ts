import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path';
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "partBrand.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const partBrandProto = grpc.loadPackageDefinition(packageDefinition) as any;

export interface AddPartBrandResponse {
  statusMessage: string,
}

export interface GetPartBrandResponse {
  id: number,
  name: string,
  slug: string,
  countryOfOrigin: string,
  description: string,
  status: string,
}

export interface ListPartBrandsResponse {
  partBrands: GetPartBrandResponse[]
}

export interface UpdatePartBrandResponse {
  statusMessage: string
}

export interface DeletePartBrandResponse {
  statusMessage: string
}

const client = new partBrandProto.partBrand.PartBrandService(
  `127.0.0.1:${process.env.GRPCPORT}`,
  grpc.credentials.createInsecure(),
);

export default client