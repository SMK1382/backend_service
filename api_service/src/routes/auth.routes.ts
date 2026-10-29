import express, { type Request, type Response } from 'express'
import z from 'zod'
import client, { type AddUserResponse, type GetUserResponse, type UpdateUserResponse, type DeleteUserResponse } from '../grpc/auth.user.grpc.js'
import * as grpc from '@grpc/grpc-js'



const router = express.Router()

router.post('/register', (req: Request, res: Response) => {
    const schema = z.object({
        firstName: z.string().min(2, 'نام باید حداقل ۲ حرف باشد').max(60),
        lastName: z.string().min(2, 'نام خانوادگی باید حداقل ۲ حرف باشد').max(60),
        email: z.string().email('ایمیل معتبر نیست').max(150),
        phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد'),
        role: z.enum(['Super_Admin', 'Super', 'User']).default('User'),
    })
    const user = {
        firstName: "Mohammadreza",
        lastName: "Kalali",
        email: "test@gmail.com",
        phone: "09919703664",
        nationalCode: "0926715178",
    }
    const parsed = schema.safeParse(user)
    if (parsed.success) {
        client.AddUser(user, (error: grpc.ServiceError | null,
            response: AddUserResponse) => {
                // console.log("addUser callback")
            return res.json(response)
        })
    }
    else {
        return res.json({ "ERROR": 401 })
    }
})

router.post('/login', (req: Request, res: Response) => {
    const schema = z.object({
        phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد'),
    })
    const test = { phone: "09919703664" }
    const parsed = schema.safeParse(test)
    if (parsed.success) {
        // console.log(parsed)
        client.GetUser(parsed.data, (error: grpc.ServiceError | null, response: GetUserResponse) => {
            return res.json(response)
        })
    }
    else {
        return res.json({ "ERROR": 401 })
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
            return res.json(response)
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
            return res.json(response)
        })
    }
    else {
        return res.json({ "ERROR": 401 })
    }
})


export default router