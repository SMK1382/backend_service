import express, { type Request, type Response } from 'express'
import z from 'zod'
import client, { type AddProductImageResponse, type ListProductImagesResponse, type GetProductImageResponse, type UpdateProductImageResponse, type DeleteProductImageResponse } from '../grpc/productImage.grpc.js'
import * as grpc from '@grpc/grpc-js'


const router = express.Router()

router.post('/add', (req: Request, res: Response) => {
    const schema = z.object({
        partId: z.number().int('شناسه قطعه باید عدد صحیح باشد'),
        url: z.string().min(1, 'آدرس تصویر نمی‌تواند خالی باشد'),
        alt: z.string().min(1, 'متن جایگزین تصویر نمی‌تواند خالی باشد').optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.AddProductImage(parsed.data, (error: grpc.ServiceError | null, response: AddProductImageResponse) => {
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
        client.GetProductImage(parsed.data, (error: grpc.ServiceError | null, response: GetProductImageResponse) => {
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
        partId: z.number().int('شناسه قطعه باید عدد صحیح باشد').optional(),
        url: z.string().min(1, 'آدرس تصویر نمی‌تواند خالی باشد').optional(),
        alt: z.string().min(1, 'متن جایگزین تصویر نمی‌تواند خالی باشد').optional(),
        sortOrder: z.number().int('ترتیب نمایش باید عدد صحیح باشد').optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.UpdateProductImage(parsed.data, (error: grpc.ServiceError | null, response: UpdateProductImageResponse) => {
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
        client.DeleteProductImage(parsed.data, (error: grpc.ServiceError | null, response: DeleteProductImageResponse) => {
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
    client.ListProductImages({}, (error: grpc.ServiceError | null, response: ListProductImagesResponse) => {
            if (response) {
                return res.json(response)
            }
            else {
                return res.json(error)
            }
        })
})

export default router