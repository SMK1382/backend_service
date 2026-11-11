import express, { type Request, type Response } from 'express'
import z from 'zod'
import client, { type AddDiscountResponse, type ListDiscountsResponse, type GetDiscountResponse, type UpdateDiscountResponse, type DeleteDiscountResponse } from '../grpc/discount.grpc.js'
import * as grpc from '@grpc/grpc-js'


const router = express.Router()

router.post('/add', (req: Request, res: Response) => {
    const schema = z.object({
        name: z.string().min(1, 'نام تخفیف نمی‌تواند خالی باشد'),
        amount: z.number().int('مقدار تخفیف باید عدد صحیح باشد'),
        discountType: z.enum(['percentage', 'fixed_amount']).optional(),
        status: z.enum(['Active', 'Inactive']).optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.AddDiscount(parsed.data, (error: grpc.ServiceError | null, response: AddDiscountResponse) => {
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
        client.GetDiscount(parsed.data, (error: grpc.ServiceError | null, response: GetDiscountResponse) => {
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
        name: z.string().min(1, 'نام تخفیف نمی‌تواند خالی باشد').optional(),
        amount: z.number().int('مقدار تخفیف باید عدد صحیح باشد').optional(),
        discountType: z.enum(['percentage', 'fixed_amount']).optional(),
        status: z.enum(['Active', 'Inactive']).optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.UpdateDiscount(parsed.data, (error: grpc.ServiceError | null, response: UpdateDiscountResponse) => {
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
        client.DeleteDiscount(parsed.data, (error: grpc.ServiceError | null, response: DeleteDiscountResponse) => {
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
    client.ListDiscounts({}, (error: grpc.ServiceError | null, response: ListDiscountsResponse) => {
            if (response) {
                return res.json(response)
            }
            else {
                return res.json(error)
            }
        })
})

export default router