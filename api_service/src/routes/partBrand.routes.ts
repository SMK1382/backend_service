import express, { type Request, type Response } from 'express'
import z from 'zod'
import client, { type AddPartBrandResponse, type ListPartBrandsResponse, type GetPartBrandResponse, type UpdatePartBrandResponse, type DeletePartBrandResponse } from '../grpc/partBrand.grpc.js'
import * as grpc from '@grpc/grpc-js'


const router = express.Router()

router.post('/add', (req: Request, res: Response) => {
    const schema = z.object({
        name: z.string().min(1, 'نام نمی‌تواند خالی باشد'),
        slug: z.string().min(1, 'اسلاگ نمی‌تواند خالی باشد'),
        countryOfOrigin: z.string().min(1, 'کشور مبدأ نمی‌تواند خالی باشد'),
        description: z.string().min(1, 'توضیحات نمی‌تواند خالی باشد').optional(),
        status: z.enum(['Active', 'Inactive']).optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.AddPartBrand(parsed.data, (error: grpc.ServiceError | null, response: AddPartBrandResponse) => {
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
        client.GetPartBrand(parsed.data, (error: grpc.ServiceError | null, response: GetPartBrandResponse) => {
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
        countryOfOrigin: z.string().min(1, 'کشور مبدأ نمی‌تواند خالی باشد').optional(),
        description: z.string().min(1, 'توضیحات نمی‌تواند خالی باشد').optional(),
        status: z.enum(['Active', 'Inactive']).optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.UpdatePartBrand(parsed.data, (error: grpc.ServiceError | null, response: UpdatePartBrandResponse) => {
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
        client.DeletePartBrand(parsed.data, (error: grpc.ServiceError | null, response: DeletePartBrandResponse) => {
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
    client.ListPartBrands({}, (error: grpc.ServiceError | null, response: ListPartBrandsResponse) => {
            if (response) {
                return res.json(response)
            }
            else {
                return res.json(error)
            }
        })
})

export default router