import express, { type Request, type Response } from 'express'
import z from 'zod'
import client, { type AddContactMessageResponse, type ListContactMessagesResponse, type GetContactMessageResponse, type UpdateContactMessageResponse, type DeleteContactMessageResponse } from '../grpc/contactMessage.grpc.js'
import * as grpc from '@grpc/grpc-js'


const router = express.Router()

router.post('/add', (req: Request, res: Response) => {
    const schema = z.object({
        name: z.string().min(1, 'نام نمی‌تواند خالی باشد'),
        email: z.string().email('ایمیل معتبر نیست').max(150),
        phone: z.string().regex(/^09[0-9]{9}$/, 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد').optional(),
        subject: z.string().min(1, 'موضوع نمی‌تواند خالی باشد'),
        message: z.string().min(1, 'متن پیام نمی‌تواند خالی باشد'),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.AddContactMessage(parsed.data, (error: grpc.ServiceError | null, response: AddContactMessageResponse) => {
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
        client.GetContactMessage(parsed.data, (error: grpc.ServiceError | null, response: GetContactMessageResponse) => {
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
        email: z.string().email('ایمیل معتبر نیست').max(150).optional(),
        phone: z.string().regex(/^09[0-9]{9}$/, 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد').optional(),
        subject: z.string().min(1, 'موضوع نمی‌تواند خالی باشد').optional(),
        message: z.string().min(1, 'متن پیام نمی‌تواند خالی باشد').optional(),
        isRead: z.boolean().optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.UpdateContactMessage(parsed.data, (error: grpc.ServiceError | null, response: UpdateContactMessageResponse) => {
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
        client.DeleteContactMessage(parsed.data, (error: grpc.ServiceError | null, response: DeleteContactMessageResponse) => {
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
    client.ListContactMessages({}, (error: grpc.ServiceError | null, response: ListContactMessagesResponse) => {
            if (response) {
                return res.json(response)
            }
            else {
                return res.json(error)
            }
        })
})

export default router