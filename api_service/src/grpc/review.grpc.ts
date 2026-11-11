import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path';
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "review.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const reviewProto = grpc.loadPackageDefinition(packageDefinition) as any;

export interface AddReviewResponse {
  statusMessage: string,
}

export interface GetReviewResponse {
  id: number,
  partId: number,
  userId: number,
  rating: number,
  comment: string,
  status: string,
}

export interface ListReviewsResponse {
  reviews: GetReviewResponse[]
}

export interface UpdateReviewResponse {
  statusMessage: string
}

export interface DeleteReviewResponse {
  statusMessage: string
}

const client = new reviewProto.review.ReviewService(
  `127.0.0.1:${process.env.GRPCPORT}`,
  grpc.credentials.createInsecure(),
);

export default client