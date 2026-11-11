import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path';
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "carModel.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const carModelProto = grpc.loadPackageDefinition(packageDefinition) as any;

export interface AddCarModelResponse {
  statusMessage: string,
}

export interface GetCarModelResponse {
  id: number,
  nameFa: string,
  nameEn: string,
  brandId: number,
  yearOfManufacture: number,
}

export interface ListCarModelsResponse {
  carModels: GetCarModelResponse[]
}

export interface UpdateCarModelResponse {
  statusMessage: string
}

export interface DeleteCarModelResponse {
  statusMessage: string
}

const client = new carModelProto.carModel.CarModelService(
  `127.0.0.1:${process.env.GRPCPORT}`,
  grpc.credentials.createInsecure(),
);

export default client