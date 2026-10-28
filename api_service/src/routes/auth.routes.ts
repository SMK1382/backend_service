import express, { type Request, type Response } from 'express'
import z from 'zod'
import client, { type AddUserResponse, type GetUserResponse } from '../grpc/auth.grpc.js'
import * as grpc from '@grpc/grpc-js'



const router = express.Router()

router.post('/register', (req: Request, res: Response) => {
    const schema = z.object({
        firstName: z.string().min(2, 'نام باید حداقل ۲ حرف باشد').max(60),
        lastName: z.string().min(2, 'نام خانوادگی باید حداقل ۲ حرف باشد').max(60),
        email: z.string().email('ایمیل معتبر نیست').max(150),
        phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد'),
        password: z.string().min(8, 'رمز عبور باید حداقل ۶ کاراکتر باشد').max(100),
        role: z.enum(['Super_Admin', 'Super', 'User']).default('User'),
    })
    const user = {
        firstName: "Mohammadreza",
        lastName: "Kalali",
        email: "test@gmail.com",
        phone: "09919703664",
        nationalCode: "0926715178",
        password: "12345678"
    }
    const parsed = schema.safeParse(user)
    // console.log("auth.routes.ts  => ok")
    if (parsed.success) {
        client.AddUser(parsed.data, (error: grpc.ServiceError | null,
            response: AddUserResponse) => {
            return res.json(response)
        })
    }
})

router.post('/login', (req: Request, res: Response) => {
    const schema = z.object({
        phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد'),
        password: z.string().min(8, 'رمز عبور باید حداقل ۶ کاراکتر باشد').max(100),
    })
    const test = { phone: "09919703664", password: "12345678" }
    const parsed = schema.safeParse(test)
    if (parsed.success) {
        client.GetUser(parsed.data, (error: grpc.ServiceError | null, response: GetUserResponse) => {
            return res.json(response)
        })
    }
})
export default router