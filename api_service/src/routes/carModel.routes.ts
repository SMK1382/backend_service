import express, { type Request, type Response } from 'express'
import z from 'zod'
import client, { type AddCarModelResponse, type ListCarModelsResponse, type GetCarModelResponse, type UpdateCarModelResponse, type DeleteCarModelResponse } from '../grpc/carModel.grpc.js'
import * as grpc from '@grpc/grpc-js'


const router = express.Router()

router.post('/add', (req: Request, res: Response) => {
    const schema = z.object({
        nameFa: z.string().min(1, 'نام فارسی نمی‌تواند خالی باشد'),
        nameEn: z.string().min(1, 'نام انگلیسی نمی‌تواند خالی باشد'),
        brandId: z.number().int('شناسه برند باید عدد صحیح باشد'),
        yearOfManufacture: z.number().int('سال ساخت باید عدد صحیح باشد'),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.AddCarModel(parsed.data, (error: grpc.ServiceError | null, response: AddCarModelResponse) => {
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
        client.GetCarModel(parsed.data, (error: grpc.ServiceError | null, response: GetCarModelResponse) => {
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
        nameFa: z.string().min(1, 'نام فارسی نمی‌تواند خالی باشد').optional(),
        nameEn: z.string().min(1, 'نام انگلیسی نمی‌تواند خالی باشد').optional(),
        brandId: z.number().int('شناسه برند باید عدد صحیح باشد').optional(),
        yearOfManufacture: z.number().int('سال ساخت باید عدد صحیح باشد').optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.UpdateCarModel(parsed.data, (error: grpc.ServiceError | null, response: UpdateCarModelResponse) => {
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
        client.DeleteCarModel(parsed.data, (error: grpc.ServiceError | null, response: DeleteCarModelResponse) => {
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
    client.ListCarModels({}, (error: grpc.ServiceError | null, response: ListCarModelsResponse) => {
            if (response) {
                return res.json(response)
            }
            else {
                return res.json(error)
            }
        })
})

export default router