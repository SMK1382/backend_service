import express, { type Request, type Response } from 'express'
import z from 'zod'
import client, { type AddSupplierResponse, type ListSuppliersResponse, type GetSupplierResponse, type UpdateSupplierResponse, type DeleteSupplierResponse } from '../grpc/supplier.grpc.js'
import * as grpc from '@grpc/grpc-js'


const router = express.Router()

router.post('/add', (req: Request, res: Response) => {
    const schema = z.object({
        supplierName: z.string().min(1, 'نام تأمین‌کننده نمی‌تواند خالی باشد'),
        supplierType: z.enum(['Manufacturer', 'Importer', 'Distributor', 'Official_Representative']).optional(),
        contactPersonName: z.string().min(1, 'نام فرد رابط نمی‌تواند خالی باشد'),
        nationalCode: z.string().regex(/^[0-9]{11}$/, 'کد ملی باید دقیقاً ۱۱ رقم باشد'),
        phoneNumber: z.string().regex(/^09[0-9]{9}$/, 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد'),
        bankAccountNumber: z.string().min(1, 'شماره حساب بانکی نمی‌تواند خالی باشد'),
        score: z.number().int('امتیاز باید عدد صحیح باشد'),
        status: z.enum(['Active', 'Inactive']).optional(),
        description: z.string().min(1, 'توضیحات نمی‌تواند خالی باشد'),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.AddSupplier(parsed.data, (error: grpc.ServiceError | null, response: AddSupplierResponse) => {
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
        client.GetSupplier(parsed.data, (error: grpc.ServiceError | null, response: GetSupplierResponse) => {
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
        supplierName: z.string().min(1, 'نام تأمین‌کننده نمی‌تواند خالی باشد').optional(),
        supplierType: z.enum(['Manufacturer', 'Importer', 'Distributor', 'Official_Representative']).optional(),
        contactPersonName: z.string().min(1, 'نام فرد رابط نمی‌تواند خالی باشد').optional(),
        nationalCode: z.string().regex(/^[0-9]{11}$/, 'کد ملی باید دقیقاً ۱۱ رقم باشد').optional(),
        phoneNumber: z.string().regex(/^09[0-9]{9}$/, 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد').optional(),
        bankAccountNumber: z.string().min(1, 'شماره حساب بانکی نمی‌تواند خالی باشد').optional(),
        score: z.number().int('امتیاز باید عدد صحیح باشد').optional(),
        status: z.enum(['Active', 'Inactive']).optional(),
        description: z.string().min(1, 'توضیحات نمی‌تواند خالی باشد').optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.UpdateSupplier(parsed.data, (error: grpc.ServiceError | null, response: UpdateSupplierResponse) => {
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
        client.DeleteSupplier(parsed.data, (error: grpc.ServiceError | null, response: DeleteSupplierResponse) => {
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
    client.ListSuppliers({}, (error: grpc.ServiceError | null, response: ListSuppliersResponse) => {
            if (response) {
                return res.json(response)
            }
            else {
                return res.json(error)
            }
        })
})

export default router