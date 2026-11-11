import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path';
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "banner.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const bannerProto = grpc.loadPackageDefinition(packageDefinition) as any;

export interface AddBannerResponse {
  statusMessage: string,
}

export interface GetBannerResponse {
  id: number,
  title: string,
  subtitle: string,
  imageUrl: string,
  linkUrl: string,
  sortOrder: number,
  isActive: boolean,
}

export interface ListBannersResponse {
  banners: GetBannerResponse[]
}

export interface UpdateBannerResponse {
  statusMessage: string
}

export interface DeleteBannerResponse {
  statusMessage: string
}

const client = new bannerProto.banner.BannerService(
  `127.0.0.1:${process.env.GRPCPORT}`,
  grpc.credentials.createInsecure(),
);

export default client