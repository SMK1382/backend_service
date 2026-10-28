import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path';
import { fileURLToPath } from "node:url";
import z from 'zod'
import auth from './routes/auth.routes.js'
// import express from 'express';
import express, {
    type Request,
    type Response,
    type NextFunction,
} from "express";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "grpc_data_api.proto");

const app = express()
const router = express.Router()


app.use('/auth', auth)

app.listen(process.env.RESTPORT, () => {
    console.log(`server start on port ${process.env.RESTPORT}`)
})
