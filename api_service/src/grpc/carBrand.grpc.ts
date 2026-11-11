import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path';
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "carBrand.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const carBrandProto = grpc.loadPackageDefinition(packageDefinition) as any;

export interface AddCarBrandResponse {
  statusMessage: string,
}

export interface GetCarBrandResponse {
  id: number,
  name: string,
  slug: string,
  country: string,
  description: string,
  isActive: boolean,
}

export interface ListCarBrandsResponse {
  carBrands: GetCarBrandResponse[]
}

export interface UpdateCarBrandResponse {
  statusMessage: string
}

export interface DeleteCarBrandResponse {
  statusMessage: string
}

const client = new carBrandProto.carBrand.CarBrandService(
  `127.0.0.1:${process.env.GRPCPORT}`,
  grpc.credentials.createInsecure(),
);

export default client