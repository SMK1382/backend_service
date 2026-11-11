import express, { type Request, type Response } from 'express'
import z from 'zod'
import client, { type AddBannerResponse, type ListBannersResponse, type GetBannerResponse, type UpdateBannerResponse, type DeleteBannerResponse } from '../grpc/banner.grpc.js'
import * as grpc from '@grpc/grpc-js'


const router = express.Router()

router.post('/add', (req: Request, res: Response) => {
    const schema = z.object({
        title: z.string().min(1, 'عنوان نمی‌تواند خالی باشد'),
        subtitle: z.string().min(1, 'زیرعنوان نمی‌تواند خالی باشد').optional(),
        imageUrl: z.string().min(1, 'آدرس تصویر نمی‌تواند خالی باشد'),
        linkUrl: z.string().min(1, 'آدرس لینک نمی‌تواند خالی باشد'),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.AddBanner(parsed.data, (error: grpc.ServiceError | null, response: AddBannerResponse) => {
            if (response) {
                return res.json(response)
            }
            else {
                return res.json(error)
            }
        })
    }
    else {
        return res.json({ "ERROR": parsed.error })
    }
})

router.post('/get', (req: Request, res: Response) => {
    const schema = z.object({
        id: z.number().int('شناسه باید عدد صحیح باشد').positive('شناسه باید مثبت باشد'),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.GetBanner(parsed.data, (error: grpc.ServiceError | null, response: GetBannerResponse) => {
            if (response) {
                return res.json(response)
            }
            else {
                return res.json(error)
            }
        })
    }
    else {
        return res.json({ "ERROR": parsed.error })
    }
})

router.post('/update', (req: Request, res: Response) => {
    const schema = z.object({
        id: z.number().int('شناسه باید عدد صحیح باشد').positive('شناسه باید مثبت باشد'),
        title: z.string().min(1, 'عنوان نمی‌تواند خالی باشد').optional(),
        subtitle: z.string().min(1, 'زیرعنوان نمی‌تواند خالی باشد').optional(),
        imageUrl: z.string().min(1, 'آدرس تصویر نمی‌تواند خالی باشد').optional(),
        linkUrl: z.string().min(1, 'آدرس لینک نمی‌تواند خالی باشد').optional(),
        sortOrder: z.number().int('ترتیب نمایش باید عدد صحیح باشد').optional(),
        isActive: z.boolean().optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.UpdateBanner(parsed.data, (error: grpc.ServiceError | null, response: UpdateBannerResponse) => {
            if (response) {
                return res.json(response)
            }
            else {
                return res.json(error)
            }
        })
    }
    else {
        return res.json({ "ERROR": parsed.error })
    }
})

router.post('/delete', (req: Request, res: Response) => {
    const schema = z.object({
        id: z.number().int('شناسه باید عدد صحیح باشد').positive('شناسه باید مثبت باشد'),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.DeleteBanner(parsed.data, (error: grpc.ServiceError | null, response: DeleteBannerResponse) => {
            if (response) {
                return res.json(response)
            }
            else {
                return res.json(error)
            }
        })
    }
    else {
        return res.json({ "ERROR": parsed.error })
    }
})

router.post('/list', (req, res) => {
    client.ListBanners({}, (error: grpc.ServiceError | null, response: ListBannersResponse) => {
            if (response) {
                return res.json(response)
            }
            else {
                return res.json(error)
            }
        })
})

export default router