import express, { type Request, type Response } from 'express'
import z from 'zod'
import client, { type AddOrderItemResponse, type ListOrderItemsResponse, type GetOrderItemResponse, type UpdateOrderItemResponse, type DeleteOrderItemResponse } from '../grpc/orderItem.grpc.js'
import * as grpc from '@grpc/grpc-js'


const router = express.Router()

router.post('/add', (req: Request, res: Response) => {
    const schema = z.object({
        orderId: z.number().int('شناسه سفارش باید عدد صحیح باشد'),
        partId: z.number().int('شناسه قطعه باید عدد صحیح باشد'),
        partName: z.string().min(1, 'نام قطعه نمی‌تواند خالی باشد'),
        partNumber: z.string().min(1, 'کد فنی قطعه نمی‌تواند خالی باشد').optional(),
        imageUrl: z.string().min(1, 'آدرس تصویر نمی‌تواند خالی باشد').optional(),
        unitPrice: z.number().int('قیمت واحد باید عدد صحیح باشد'),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.AddOrderItem(parsed.data, (error: grpc.ServiceError | null, response: AddOrderItemResponse) => {
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
        client.GetOrderItem(parsed.data, (error: grpc.ServiceError | null, response: GetOrderItemResponse) => {
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
        partId: z.number().int('شناسه قطعه باید عدد صحیح باشد').optional(),
        partName: z.string().min(1, 'نام قطعه نمی‌تواند خالی باشد').optional(),
        partNumber: z.string().min(1, 'کد فنی قطعه نمی‌تواند خالی باشد').optional(),
        imageUrl: z.string().min(1, 'آدرس تصویر نمی‌تواند خالی باشد').optional(),
        quantity: z.number().int('تعداد باید عدد صحیح باشد').optional(),
        unitPrice: z.number().int('قیمت واحد باید عدد صحیح باشد').optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.UpdateOrderItem(parsed.data, (error: grpc.ServiceError | null, response: UpdateOrderItemResponse) => {
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
        client.DeleteOrderItem(parsed.data, (error: grpc.ServiceError | null, response: DeleteOrderItemResponse) => {
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
    client.ListOrderItems({}, (error: grpc.ServiceError | null, response: ListOrderItemsResponse) => {
            if (response) {
                return res.json(response)
            }
            else {
                return res.json(error)
            }
        })
})

export default router