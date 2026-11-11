import express, { type Request, type Response } from 'express'
import z from 'zod'
import client, { type AddReturnRequestResponse, type ListReturnRequestsResponse, type GetReturnRequestResponse, type UpdateReturnRequestResponse, type DeleteReturnRequestResponse } from '../grpc/returnRequest.grpc.js'
import * as grpc from '@grpc/grpc-js'


const router = express.Router()

router.post('/add', (req: Request, res: Response) => {
    const schema = z.object({
        orderId: z.number().int('شناسه سفارش باید عدد صحیح باشد'),
        userId: z.number().int('شناسه کاربر باید عدد صحیح باشد'),
        reasonDescription: z.string().min(1, 'دلیل درخواست مرجوعی نمی‌تواند خالی باشد').optional(),
        status: z.enum(['Active', 'Inactive']).optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.AddReturnRequest(parsed.data, (error: grpc.ServiceError | null, response: AddReturnRequestResponse) => {
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
        client.GetReturnRequest(parsed.data, (error: grpc.ServiceError | null, response: GetReturnRequestResponse) => {
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
        orderId: z.number().int('شناسه سفارش باید عدد صحیح باشد').optional(),
        userId: z.number().int('شناسه کاربر باید عدد صحیح باشد').optional(),
        reasonDescription: z.string().min(1, 'دلیل درخواست مرجوعی نمی‌تواند خالی باشد').optional(),
        status: z.enum(['Active', 'Inactive']).optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.UpdateReturnRequest(parsed.data, (error: grpc.ServiceError | null, response: UpdateReturnRequestResponse) => {
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
        client.DeleteReturnRequest(parsed.data, (error: grpc.ServiceError | null, response: DeleteReturnRequestResponse) => {
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
    client.ListReturnRequests({}, (error: grpc.ServiceError | null, response: ListReturnRequestsResponse) => {
            if (response) {
                return res.json(response)
            }
            else {
                return res.json(error)
            }
        })
})

export default router