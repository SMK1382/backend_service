import express, { type Request, type Response } from 'express'
import z from 'zod'
import client, { type AddAddressResponse, type ListAddressesResponse, type GetAddressResponse, type UpdateAddressResponse, type DeleteAddressResponse } from '../grpc/address.grpc.js'
import * as grpc from '@grpc/grpc-js'


const router = express.Router()

router.post('/add', (req: Request, res: Response) => {
    const schema = z.object({
        userId: z.number().int('شناسه کاربر باید عدد صحیح باشد'),
        receiverName: z.string().min(1, 'نام گیرنده نمی‌تواند خالی باشد'),
        receiverPhone: z.string().regex(/^09[0-9]{9}$/, 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد'),
        province: z.string().min(1, 'استان نمی‌تواند خالی باشد'),
        city: z.string().min(1, 'شهر نمی‌تواند خالی باشد'),
        postalCode: z.string().regex(/^[0-9]{10}$/, 'کد پستی باید دقیقاً ۱۰ رقم باشد'),
        line: z.string().min(1, 'نشانی کامل نمی‌تواند خالی باشد'),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.AddAddress(parsed.data, (error: grpc.ServiceError | null, response: AddAddressResponse) => {
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
        client.GetAddress(parsed.data, (error: grpc.ServiceError | null, response: GetAddressResponse) => {
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
        receiverName: z.string().min(1, 'نام گیرنده نمی‌تواند خالی باشد').optional(),
        receiverPhone: z.string().regex(/^09[0-9]{9}$/, 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد').optional(),
        province: z.string().min(1, 'استان نمی‌تواند خالی باشد').optional(),
        city: z.string().min(1, 'شهر نمی‌تواند خالی باشد').optional(),
        postalCode: z.string().regex(/^[0-9]{10}$/, 'کد پستی باید دقیقاً ۱۰ رقم باشد').optional(),
        line: z.string().min(1, 'نشانی کامل نمی‌تواند خالی باشد').optional(),
        isDefault: z.boolean().optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.UpdateAddress(parsed.data, (error: grpc.ServiceError | null, response: UpdateAddressResponse) => {
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
        client.DeleteAddress(parsed.data, (error: grpc.ServiceError | null, response: DeleteAddressResponse) => {
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
    client.ListAddresses({}, (error: grpc.ServiceError | null, response: ListAddressesResponse) => {
            if (response) {
                return res.json(response)
            }
            else {
                return res.json(error)
            }
        })
})

export default router