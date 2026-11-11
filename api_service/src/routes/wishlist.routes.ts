import express, { type Request, type Response } from 'express'
import z from 'zod'
import client, { type AddWishlistResponse, type ListWishlistResponse, type GetWishlistResponse, type UpdateWishlistResponse, type DeleteWishlistResponse } from '../grpc/wishlist.grpc.js'
import * as grpc from '@grpc/grpc-js'


const router = express.Router()

router.post('/add', (req: Request, res: Response) => {
    const schema = z.object({
        userId: z.number().int('شناسه کاربر باید عدد صحیح باشد'),
        partId: z.number().int('شناسه قطعه باید عدد صحیح باشد'),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.AddWishlist(parsed.data, (error: grpc.ServiceError | null, response: AddWishlistResponse) => {
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
        client.GetWishlist(parsed.data, (error: grpc.ServiceError | null, response: GetWishlistResponse) => {
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
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.UpdateWishlist(parsed.data, (error: grpc.ServiceError | null, response: UpdateWishlistResponse) => {
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
        client.DeleteWishlist(parsed.data, (error: grpc.ServiceError | null, response: DeleteWishlistResponse) => {
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
    client.ListWishlist({}, (error: grpc.ServiceError | null, response: ListWishlistResponse) => {
            if (response) {
                return res.json(response)
            }
            else {
                return res.json(error)
            }
        })
})

export default router