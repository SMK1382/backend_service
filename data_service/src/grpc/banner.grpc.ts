import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path'
import { fileURLToPath } from "node:url";
import {
    type AddBannerRequest,
    type AddBannerResponse,
    type GetBannerRequest,
    type GetBannerResponse,
    type ListBannersRequest,
    type ListBannersResponse,
    type UpdateBannerRequest,
    type UpdateBannerResponse,
    type DeleteBannerRequest,
    type DeleteBannerResponse
} from './interfaces/banner.interface.js';
import db from '../db/index.js'
import { banners } from '../db/schema.js';
import {
    eq,
} from "drizzle-orm";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "..", "..", "..", "proto", "banner.proto");

export const bannerPackageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});



export async function addBanner(call: grpc.ServerUnaryCall<AddBannerRequest, AddBannerResponse>, callBack: grpc.sendUnaryData<AddBannerResponse>) {
    try {
        const data = call.request;
        const created = await db.insert(banners).values({
            title: data.title,
            subtitle: data.subtitle || null,
            imageUrl: data.imageUrl,
            linkUrl: data.linkUrl,
        })
        if (created) {
            return callBack(null, { statusMessage: "banner added" });
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "add banner error",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `add banner error: ${error}`,
        })
    }
}

export async function getBanner(call: grpc.ServerUnaryCall<GetBannerRequest, GetBannerResponse>, callBack: grpc.sendUnaryData<GetBannerResponse>) {
    try {
        const data = call.request

        const row = await db.select().from(banners).where(eq(banners.id, data.id))
        if (row[0]) {
            return callBack(null, row[0])
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "banner not found",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `get banner error: ${error}`,
        })
    }
}

export async function listBanners(call: grpc.ServerUnaryCall<ListBannersRequest, ListBannersResponse>, callBack: grpc.sendUnaryData<ListBannersResponse>) {
    try {
        const rowList: GetBannerResponse[] = await db
            .select()
            .from(banners)
        if (rowList) {
            return callBack(null, {
                banners: rowList
            })
        }
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `list banner error: ${error}`,
        })
    }
}

export async function updateBanner(call: grpc.ServerUnaryCall<UpdateBannerRequest, UpdateBannerResponse>, callBack: grpc.sendUnaryData<UpdateBannerResponse>) {
    try {
        const data = call.request
        const row = await db.select().from(banners).where(eq(banners.id, data.id))
        const result = await db
            .update(banners)
            .set({
            title: data.title || row[0]?.title,
            subtitle: data.subtitle || row[0]?.subtitle,
            imageUrl: data.imageUrl || row[0]?.imageUrl,
            linkUrl: data.linkUrl || row[0]?.linkUrl,
            sortOrder: data.sortOrder || row[0]?.sortOrder,
            isActive: data.isActive || row[0]?.isActive,
            })
            .where(eq(banners.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "banner updated" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "update banner error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `update banner error: ${error}`,
        })
    }
}

export async function deleteBanner(call: grpc.ServerUnaryCall<DeleteBannerRequest, DeleteBannerResponse>, callBack: grpc.sendUnaryData<DeleteBannerResponse>) {
    try {
        const data: DeleteBannerRequest = call.request
        const result = await db
            .delete(banners)
            .where(eq(banners.id, data.id));
        if (result) {
            return callBack(null, { statusMessage: "banner deleted" })
        }
        return callBack({
            code: grpc.status.NOT_FOUND,
            message: "delete banner error!!!",
        })
    } catch (error) {
        return callBack({
            code: grpc.status.INTERNAL,
            message: `delete banner error: ${error}`,
        })
    }
}