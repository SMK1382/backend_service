import express, { type Request, type Response } from 'express'
import z from 'zod'
import client, { type AddCarBrandResponse, type ListCarBrandsResponse, type GetCarBrandResponse, type UpdateCarBrandResponse, type DeleteCarBrandResponse } from '../grpc/carBrand.grpc.js'
import * as grpc from '@grpc/grpc-js'


const router = express.Router()

router.post('/add', (req: Request, res: Response) => {
    const schema = z.object({
        name: z.string().min(1, 'نام نمی‌تواند خالی باشد'),
        slug: z.string().min(1, 'اسلاگ نمی‌تواند خالی باشد'),
        country: z.string().min(1, 'کشور نمی‌تواند خالی باشد'),
        description: z.string().min(1, 'توضیحات نمی‌تواند خالی باشد').optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.AddCarBrand(parsed.data, (error: grpc.ServiceError | null, response: AddCarBrandResponse) => {
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
        client.GetCarBrand(parsed.data, (error: grpc.ServiceError | null, response: GetCarBrandResponse) => {
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
        country: z.string().min(1, 'کشور نمی‌تواند خالی باشد').optional(),
        description: z.string().min(1, 'توضیحات نمی‌تواند خالی باشد').optional(),
        isActive: z.boolean().optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.UpdateCarBrand(parsed.data, (error: grpc.ServiceError | null, response: UpdateCarBrandResponse) => {
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
        client.DeleteCarBrand(parsed.data, (error: grpc.ServiceError | null, response: DeleteCarBrandResponse) => {
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
    client.ListCarBrands({}, (error: grpc.ServiceError | null, response: ListCarBrandsResponse) => {
            if (response) {
                return res.json(response)
            }
            else {
                return res.json(error)
            }
        })
})

export default router