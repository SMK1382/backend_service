import express, { type Request, type Response } from 'express'
import z from 'zod'
import client, { type AddPartResponse, type ListPartsResponse, type GetPartResponse, type UpdatePartResponse, type DeletePartResponse } from '../grpc/part.grpc.js'
import * as grpc from '@grpc/grpc-js'


const router = express.Router()

router.post('/add', (req: Request, res: Response) => {
    const schema = z.object({
        name: z.string().min(1, 'نام نمی‌تواند خالی باشد'),
        slug: z.string().min(1, 'اسلاگ نمی‌تواند خالی باشد'),
        brandId: z.number().int('شناسه برند قطعه باید عدد صحیح باشد').optional(),
        description: z.string().min(1, 'توضیحات نمی‌تواند خالی باشد').optional(),
        price: z.number().int('قیمت (تومان) باید عدد صحیح باشد'),
        discountAmount: z.number().int('شناسه تخفیف باید عدد صحیح باشد').optional(),
        partNumber: z.string().min(1, 'کد فنی قطعه نمی‌تواند خالی باشد').optional(),
        weightGrams: z.number().int('وزن (گرم) باید عدد صحیح باشد').optional(),
        supplierId: z.number().int('شناسه تأمین‌کننده باید عدد صحیح باشد'),
        unit: z.enum(['Number', 'Pair', 'Set']).optional(),
        categoryId: z.number().int('شناسه دسته‌بندی باید عدد صحیح باشد').optional(),
        status: z.enum(['Active', 'Inactive']).optional(),
        metaTitle: z.string().min(1, 'عنوان سئو نمی‌تواند خالی باشد').optional(),
        metaDescription: z.string().min(1, 'توضیحات سئو نمی‌تواند خالی باشد').optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.AddPart(parsed.data, (error: grpc.ServiceError | null, response: AddPartResponse) => {
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
        client.GetPart(parsed.data, (error: grpc.ServiceError | null, response: GetPartResponse) => {
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
        name: z.string().min(1, 'نام نمی‌تواند خالی باشد').optional(),
        slug: z.string().min(1, 'اسلاگ نمی‌تواند خالی باشد').optional(),
        brandId: z.number().int('شناسه برند قطعه باید عدد صحیح باشد').optional(),
        description: z.string().min(1, 'توضیحات نمی‌تواند خالی باشد').optional(),
        price: z.number().int('قیمت (تومان) باید عدد صحیح باشد').optional(),
        discountAmount: z.number().int('شناسه تخفیف باید عدد صحیح باشد').optional(),
        stock: z.number().int('موجودی انبار باید عدد صحیح باشد').optional(),
        partNumber: z.string().min(1, 'کد فنی قطعه نمی‌تواند خالی باشد').optional(),
        weightGrams: z.number().int('وزن (گرم) باید عدد صحیح باشد').optional(),
        supplierId: z.number().int('شناسه تأمین‌کننده باید عدد صحیح باشد').optional(),
        unit: z.enum(['Number', 'Pair', 'Set']).optional(),
        categoryId: z.number().int('شناسه دسته‌بندی باید عدد صحیح باشد').optional(),
        status: z.enum(['Active', 'Inactive']).optional(),
        isFeatured: z.boolean().optional(),
        metaTitle: z.string().min(1, 'عنوان سئو نمی‌تواند خالی باشد').optional(),
        metaDescription: z.string().min(1, 'توضیحات سئو نمی‌تواند خالی باشد').optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.UpdatePart(parsed.data, (error: grpc.ServiceError | null, response: UpdatePartResponse) => {
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
        client.DeletePart(parsed.data, (error: grpc.ServiceError | null, response: DeletePartResponse) => {
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
    client.ListParts({}, (error: grpc.ServiceError | null, response: ListPartsResponse) => {
            if (response) {
                return res.json(response)
            }
            else {
                return res.json(error)
            }
        })
})

export default router