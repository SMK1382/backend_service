import express, { type Request, type Response } from 'express'
import z from 'zod'
import client, { type AddUserResponse, type ListUsersResponse, type GetUserResponse, type UpdateUserResponse, type DeleteUserResponse } from '../grpc/auth.grpc.js'
import * as grpc from '@grpc/grpc-js'



const router = express.Router()

router.post('/register', (req: Request, res: Response) => {
    const schema = z.object({
        firstName: z.string().min(2, 'نام باید حداقل ۲ حرف باشد').max(60),
        lastName: z.string().min(2, 'نام خانوادگی باید حداقل ۲ حرف باشد').max(60),
        email: z.string().email('ایمیل معتبر نیست').max(150),
        phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد'),
        nationalCode: z.string().min(10, 'کد ملی باید ۱۰ رقم باشد').max(10)
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.AddUser(parsed.data, (error: grpc.ServiceError | null, response: AddUserResponse) => {
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

router.post('/login', (req: Request, res: Response) => {
    const schema = z.object({
        phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد'),
    })
    // console.log(req.body)
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        // console.log(parsed)
        client.GetUser(parsed.data, (error: grpc.ServiceError | null, response: GetUserResponse) => {
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
        phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد'),
    })
    const test = { phone: "09919703664" }
    const parsed = schema.safeParse(test)
    if (parsed.success) {
        client.updateUser(parsed.data, (error: grpc.ServiceError | null, response: UpdateUserResponse) => {
            if (response) {
                return res.json(response)
            }
            else {
                return res.json(error)
            }
        })
    }
    else {
        return res.json({ "ERROR": 401 })
    }
})

router.post('/delete', (req: Request, res: Response) => {
    const schema = z.object({
        phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد'),
    })
    const test = { phone: "09919703664" }
    const parsed = schema.safeParse(test)
    if (parsed.success) {
        client.deleteUser(parsed.data, (error: grpc.ServiceError | null, response: DeleteUserResponse) => {
            if (response) {
                return res.json(response)
            }
            else {
                return res.json(error)
            }
        })
    }
    else {
        return res.json({ "ERROR": 401 })
    }
})

router.post('/list', (req, res) => {
    client.ListUsers({}, (error: grpc.ServiceError | null, response: ListUsersResponse) => {
        if (response) {
            return res.json(response)
        }
        else {
            return res.json(error)
        }
    })
})

export default router