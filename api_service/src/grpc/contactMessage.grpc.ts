import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path';
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "contactMessage.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const contactMessageProto = grpc.loadPackageDefinition(packageDefinition) as any;

export interface AddContactMessageResponse {
  statusMessage: string,
}

export interface GetContactMessageResponse {
  id: number,
  name: string,
  email: string,
  phone: string,
  subject: string,
  message: string,
  isRead: boolean,
}

export interface ListContactMessagesResponse {
  contactMessages: GetContactMessageResponse[]
}

export interface UpdateContactMessageResponse {
  statusMessage: string
}

export interface DeleteContactMessageResponse {
  statusMessage: string
}

const client = new contactMessageProto.contactMessage.ContactMessageService(
  `127.0.0.1:${process.env.GRPCPORT}`,
  grpc.credentials.createInsecure(),
);

export default client