import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path'
import { fileURLToPath } from "node:url";
import {
    type AddReviewRequest,
    type AddReviewResponse,
    type GetReviewRequest,
    type GetReviewResponse,
    type ListReviewsRequest,
    type ListReviewsResponse,
    type UpdateReviewRequest,
    type UpdateReviewResponse,
    type DeleteReviewRequest,
    type DeleteReviewResponse
} from './interfaces/review.interface.js';
import db from '../db/index.js'
import { reviews } from '../db/schema.js';
import {
    eq,
} from "drizzle-orm";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "review.proto");

export const reviewPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});



export async function addReview(call: grpc.ServerUnaryCall<AddReviewRequest, AddReviewResponse>, callBack: grpc.sendUnaryData<AddReviewResponse>) {
    try {
        const data = call.request;
        const created = await db.insert(reviews).values({
            partId: data.partId,
            userId: data.userId,
            rating: data.rating,
            comment: data.comment,
            status: data.status || undefined,
        })
        if (created) {
            return callBack(null, { statusMessage: "review added" });
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "add review error",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `add review error: ${error}`,
        })
    }
}

export async function getReview(call: grpc.ServerUnaryCall<GetReviewRequest, GetReviewResponse>, callBack: grpc.sendUnaryData<GetReviewResponse>) {
    try {
        const data = call.request

        const row = await db.select().from(reviews).where(eq(reviews.id, data.id))
        if (row[0]) {
            return callBack(null, row[0])
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "review not found",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `get review error: ${error}`,
        })
    }
}

export async function listReviews(call: grpc.ServerUnaryCall<ListReviewsRequest, ListReviewsResponse>, callBack: grpc.sendUnaryData<ListReviewsResponse>) {
    try {
        const rowList: GetReviewResponse[] = await db
            .select()
            .from(reviews)
        if (rowList) {
            return callBack(null, {
                reviews: rowList
            })
        }
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `list review error: ${error}`,
        })
    }
}

export async function updateReview(call: grpc.ServerUnaryCall<UpdateReviewRequest, UpdateReviewResponse>, callBack: grpc.sendUnaryData<UpdateReviewResponse>) {
    try {
        const data = call.request
        const row = await db.select().from(reviews).where(eq(reviews.id, data.id))
        const result = await db
            .update(reviews)
            .set({
            partId: data.partId || row[0]?.partId,
            userId: data.userId || row[0]?.userId,
            rating: data.rating || row[0]?.rating,
            comment: data.comment || row[0]?.comment,
            status: data.status || row[0]?.status,
            })
            .where(eq(reviews.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "review updated" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "update review error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `update review error: ${error}`,
        })
    }
}

export async function deleteReview(call: grpc.ServerUnaryCall<DeleteReviewRequest, DeleteReviewResponse>, callBack: grpc.sendUnaryData<DeleteReviewResponse>) {
    try {
        const data: DeleteReviewRequest = call.request
        const result = await db
            .delete(reviews)
            .where(eq(reviews.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "review deleted" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "delete review error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `delete review error: ${error}`,
        })
    }
}