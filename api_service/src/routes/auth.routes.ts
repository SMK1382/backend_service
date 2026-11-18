import express, { type Request, type Response } from 'express'
import z from 'zod'
import client, { type AddUserResponse, type ListUsersResponse, type GetUserResponse, type UpdateUserResponse, type DeleteUserResponse } from '../grpc/auth.grpc.js'
import * as grpc from '@grpc/grpc-js'
import { signToken } from '../lib/auth.js';
import { verifyToken } from '../middleware/auth.js';



const router = express.Router()

const schemaRegister = z.object({
    firstName: z.string().min(2, 'نام باید حداقل ۲ حرف باشد').max(60),
    lastName: z.string().min(2, 'نام خانوادگی باید حداقل ۲ حرف باشد').max(60),
    email: z.string().email('ایمیل معتبر نیست').max(150),
    phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد'),
    nationalCode: z.string().min(10, 'کد ملی باید ۱۰ رقم باشد').max(10)
})
router.post('/register', (req: Request, res: Response) => {
    const parsed = schemaRegister.safeParse(req.body)
    if (parsed.success) {
        // const testAuthenticationCode : number = 123456
        const token = signToken({ phone: parsed.data.phone, role: 'User' }) as string
        client.AddUser(parsed.data, (error: grpc.ServiceError | null, response: AddUserResponse) => {
            if (response) {
                return res.status(200).json({ token, response })
            }
            else {
                return res.status(500).json(error)
            }
        })
    }
    else {
        return res.status(400).json({ "ERROR": parsed.error })
    }
})


const schemaPhone = z.object({
    phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد'),
})

// نقش‌های مجاز — مطابق TokenPayload در lib/auth.ts
const ROLES = ['User', 'Admin', 'Super_Admin'] as const
const isRole = (r: string): r is (typeof ROLES)[number] =>
    (ROLES as readonly string[]).includes(r)

router.post('/login', (req: Request, res: Response) => {
    // console.log(req.body)
    const parsed = schemaPhone.safeParse(req.body)
    if (parsed.success) {
        // console.log(parsed)
        // const token = signToken({ phone: parsed.data.phone, role: 'User' }) as string
        client.GetUser(parsed.data, (error: grpc.ServiceError | null, response: GetUserResponse) => {
            if (response) {
                const token = signToken({ phone: response.phone, role: response.role as  'User' | 'Admin' | 'Super_Admin' }) as string
                return res.status(200).json({token, response})
            }
            else {
                return res.status(500).json(error)
            }
        })
    }
    else {
        return res.status(400).json({ "ERROR": parsed.error })
    }
})
const schemaUpdate = z.object({
    phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد'),
    firstName: z.string().min(2, 'نام باید حداقل ۲ حرف باشد').max(60).optional(),
    lastName: z.string().min(2, 'نام خانوادگی باید حداقل ۲ حرف باشد').max(60).optional(),
    email: z.string().email('ایمیل معتبر نیست').max(150).optional(),
    status: z.enum(["Active", "Inactive"]).optional(),
    role: z.enum(['Super_Admin', 'Admin', 'User']).optional()
})
router.post('/update', verifyToken, (req: Request, res: Response) => {

    // const test = { phone: "09919703664" }
    const parsed = schemaUpdate.safeParse(req.body)
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
        return res.json({ "ERROR": parsed.error })
    }
})

router.post('/delete', verifyToken, (req: Request, res: Response) => {
    const parsed = schemaPhone.safeParse(req.body)
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
        return res.json({ "ERROR": parsed.error })
    }
})

router.post('/list', verifyToken, (req, res) => {
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