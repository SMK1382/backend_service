import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path';
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "category.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const categoryProto = grpc.loadPackageDefinition(packageDefinition) as any;

export interface AddCategoryResponse {
  statusMessage: string,
}

export interface GetCategoryResponse {
  id: number,
  name: string,
  slug: string,
  parentId: number,
  sortOrder: number,
  isActive: boolean,
}

export interface ListCategoriesResponse {
  categories: GetCategoryResponse[]
}

export interface UpdateCategoryResponse {
  statusMessage: string
}

export interface DeleteCategoryResponse {
  statusMessage: string
}

const client = new categoryProto.category.CategoryService(
  `127.0.0.1:${process.env.GRPCPORT}`,
  grpc.credentials.createInsecure(),
);

export default client