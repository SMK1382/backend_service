import express, { type Request, type Response } from 'express'
import z from 'zod'
import client, { type AddPartCompatibilityResponse, type ListPartCompatibilitiesResponse, type GetPartCompatibilityResponse, type UpdatePartCompatibilityResponse, type DeletePartCompatibilityResponse } from '../grpc/partCompatibility.grpc.js'
import * as grpc from '@grpc/grpc-js'


const router = express.Router()

router.post('/add', (req: Request, res: Response) => {
    const schema = z.object({
        partId: z.number().int('شناسه قطعه باید عدد صحیح باشد'),
        carModelId: z.number().int('شناسه مدل خودرو باید عدد صحیح باشد'),
        yearsNote: z.string().min(1, 'بازه سال‌های سازگاری نمی‌تواند خالی باشد'),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.AddPartCompatibility(parsed.data, (error: grpc.ServiceError | null, response: AddPartCompatibilityResponse) => {
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
        client.GetPartCompatibility(parsed.data, (error: grpc.ServiceError | null, response: GetPartCompatibilityResponse) => {
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
        carModelId: z.number().int('شناسه مدل خودرو باید عدد صحیح باشد').optional(),
        yearsNote: z.string().min(1, 'بازه سال‌های سازگاری نمی‌تواند خالی باشد').optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.UpdatePartCompatibility(parsed.data, (error: grpc.ServiceError | null, response: UpdatePartCompatibilityResponse) => {
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
        client.DeletePartCompatibility(parsed.data, (error: grpc.ServiceError | null, response: DeletePartCompatibilityResponse) => {
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
    client.ListPartCompatibilities({}, (error: grpc.ServiceError | null, response: ListPartCompatibilitiesResponse) => {
            if (response) {
                return res.json(response)
            }
            else {
                return res.json(error)
            }
        })
})

export default router