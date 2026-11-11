import express, { type Request, type Response } from 'express'
import z from 'zod'
import client, { type AddShoppingCartResponse, type ListShoppingCartResponse, type GetShoppingCartResponse, type UpdateShoppingCartResponse, type DeleteShoppingCartResponse } from '../grpc/shoppingCart.grpc.js'
import * as grpc from '@grpc/grpc-js'


const router = express.Router()

router.post('/add', (req: Request, res: Response) => {
    const schema = z.object({
        userId: z.number().int('شناسه کاربر باید عدد صحیح باشد'),
        partId: z.number().int('شناسه قطعه باید عدد صحیح باشد'),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.AddShoppingCart(parsed.data, (error: grpc.ServiceError | null, response: AddShoppingCartResponse) => {
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
        client.GetShoppingCart(parsed.data, (error: grpc.ServiceError | null, response: GetShoppingCartResponse) => {
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
        partId: z.number().int('شناسه قطعه باید عدد صحیح باشد').optional(),
        quantity: z.number().int('تعداد باید عدد صحیح باشد').optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.UpdateShoppingCart(parsed.data, (error: grpc.ServiceError | null, response: UpdateShoppingCartResponse) => {
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
        client.DeleteShoppingCart(parsed.data, (error: grpc.ServiceError | null, response: DeleteShoppingCartResponse) => {
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
    client.ListShoppingCart({}, (error: grpc.ServiceError | null, response: ListShoppingCartResponse) => {
            if (response) {
                return res.json(response)
            }
            else {
                return res.json(error)
            }
        })
})

export default router