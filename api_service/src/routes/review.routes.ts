import express, { type Request, type Response } from 'express'
import z from 'zod'
import client, { type AddReviewResponse, type ListReviewsResponse, type GetReviewResponse, type UpdateReviewResponse, type DeleteReviewResponse } from '../grpc/review.grpc.js'
import * as grpc from '@grpc/grpc-js'


const router = express.Router()

router.post('/add', (req: Request, res: Response) => {
    const schema = z.object({
        partId: z.number().int('شناسه قطعه باید عدد صحیح باشد'),
        userId: z.number().int('شناسه کاربر باید عدد صحیح باشد'),
        rating: z.number().int('امتیاز باید عدد صحیح باشد').min(1, 'امتیاز بین 1 تا 5 است').max(5, 'امتیاز بین 1 تا 5 است'),
        comment: z.string().min(1, 'متن دیدگاه نمی‌تواند خالی باشد'),
        status: z.enum(['Pending', 'Approved', 'Rejected']).optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.AddReview(parsed.data, (error: grpc.ServiceError | null, response: AddReviewResponse) => {
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
        client.GetReview(parsed.data, (error: grpc.ServiceError | null, response: GetReviewResponse) => {
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
        partId: z.number().int('شناسه قطعه باید عدد صحیح باشد').optional(),
        userId: z.number().int('شناسه کاربر باید عدد صحیح باشد').optional(),
        rating: z.number().int('امتیاز باید عدد صحیح باشد').min(1, 'امتیاز بین 1 تا 5 است').max(5, 'امتیاز بین 1 تا 5 است').optional(),
        comment: z.string().min(1, 'متن دیدگاه نمی‌تواند خالی باشد').optional(),
        status: z.enum(['Pending', 'Approved', 'Rejected']).optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.UpdateReview(parsed.data, (error: grpc.ServiceError | null, response: UpdateReviewResponse) => {
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
        client.DeleteReview(parsed.data, (error: grpc.ServiceError | null, response: DeleteReviewResponse) => {
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
    client.ListReviews({}, (error: grpc.ServiceError | null, response: ListReviewsResponse) => {
            if (response) {
                return res.json(response)
            }
            else {
                return res.json(error)
            }
        })
})

export default router