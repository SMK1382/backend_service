import express, { type Request, type Response } from 'express'
import z from 'zod'
import client, { type AddOrderResponse, type ListOrdersResponse, type GetOrderResponse, type UpdateOrderResponse, type DeleteOrderResponse } from '../grpc/order.grpc.js'
import * as grpc from '@grpc/grpc-js'


const router = express.Router()

router.post('/add', (req: Request, res: Response) => {
    const schema = z.object({
        userId: z.number().int('شناسه کاربر باید عدد صحیح باشد'),
        status: z.enum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']).optional(),
        paymentMethod: z.enum(['Cod', 'Card_Transfer']),
        paymentStatus: z.enum(['Unpaid', 'Paid', 'Refunded']).optional(),
        receiverName: z.string().min(1, 'نام گیرنده نمی‌تواند خالی باشد'),
        receiverPhone: z.string().regex(/^09[0-9]{9}$/, 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد'),
        province: z.string().min(1, 'استان نمی‌تواند خالی باشد'),
        city: z.string().min(1, 'شهر نمی‌تواند خالی باشد'),
        postalCode: z.string().regex(/^[0-9]{10}$/, 'کد پستی باید دقیقاً ۱۰ رقم باشد'),
        addressLine: z.string().min(1, 'نشانی کامل نمی‌تواند خالی باشد'),
        note: z.string().min(1, 'یادداشت سفارش نمی‌تواند خالی باشد').optional(),
        itemsSubtotal: z.number().int('جمع مبلغ اقلام باید عدد صحیح باشد').optional(),
        discountAmount: z.number().int('مبلغ تخفیف باید عدد صحیح باشد').optional(),
        shippingCost: z.number().int('هزینه ارسال باید عدد صحیح باشد').optional(),
        totalAmount: z.number().int('مبلغ کل باید عدد صحیح باشد').optional(),
        trackingCode: z.string().min(1, 'کد رهگیری نمی‌تواند خالی باشد').optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.AddOrder(parsed.data, (error: grpc.ServiceError | null, response: AddOrderResponse) => {
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
        client.GetOrder(parsed.data, (error: grpc.ServiceError | null, response: GetOrderResponse) => {
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
        userId: z.number().int('شناسه کاربر باید عدد صحیح باشد').optional(),
        status: z.enum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']).optional(),
        paymentMethod: z.enum(['Cod', 'Card_Transfer']).optional(),
        paymentStatus: z.enum(['Unpaid', 'Paid', 'Refunded']).optional(),
        receiverName: z.string().min(1, 'نام گیرنده نمی‌تواند خالی باشد').optional(),
        receiverPhone: z.string().regex(/^09[0-9]{9}$/, 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد').optional(),
        province: z.string().min(1, 'استان نمی‌تواند خالی باشد').optional(),
        city: z.string().min(1, 'شهر نمی‌تواند خالی باشد').optional(),
        postalCode: z.string().regex(/^[0-9]{10}$/, 'کد پستی باید دقیقاً ۱۰ رقم باشد').optional(),
        addressLine: z.string().min(1, 'نشانی کامل نمی‌تواند خالی باشد').optional(),
        note: z.string().min(1, 'یادداشت سفارش نمی‌تواند خالی باشد').optional(),
        itemsSubtotal: z.number().int('جمع مبلغ اقلام باید عدد صحیح باشد').optional(),
        discountAmount: z.number().int('مبلغ تخفیف باید عدد صحیح باشد').optional(),
        shippingCost: z.number().int('هزینه ارسال باید عدد صحیح باشد').optional(),
        totalAmount: z.number().int('مبلغ کل باید عدد صحیح باشد').optional(),
        trackingCode: z.string().min(1, 'کد رهگیری نمی‌تواند خالی باشد').optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.UpdateOrder(parsed.data, (error: grpc.ServiceError | null, response: UpdateOrderResponse) => {
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
        client.DeleteOrder(parsed.data, (error: grpc.ServiceError | null, response: DeleteOrderResponse) => {
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
    client.ListOrders({}, (error: grpc.ServiceError | null, response: ListOrdersResponse) => {
            if (response) {
                return res.json(response)
            }
            else {
                return res.json(error)
            }
        })
})

export default router