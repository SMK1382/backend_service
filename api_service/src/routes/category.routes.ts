import express, { type Request, type Response } from 'express'
import z from 'zod'
import client, { type AddCategoryResponse, type ListCategoriesResponse, type GetCategoryResponse, type UpdateCategoryResponse, type DeleteCategoryResponse } from '../grpc/category.grpc.js'
import * as grpc from '@grpc/grpc-js'


const router = express.Router()

router.post('/add', (req: Request, res: Response) => {
    const schema = z.object({
        name: z.string().min(1, 'نام نمی‌تواند خالی باشد'),
        slug: z.string().min(1, 'اسلاگ نمی‌تواند خالی باشد'),
        parentId: z.number().int('شناسه دسته والد باید عدد صحیح باشد').optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.AddCategory(parsed.data, (error: grpc.ServiceError | null, response: AddCategoryResponse) => {
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
        client.GetCategory(parsed.data, (error: grpc.ServiceError | null, response: GetCategoryResponse) => {
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
        slug: z.string().min(1, 'اسلاگ نمی‌تواند خالی باشد').optional(),
        parentId: z.number().int('شناسه دسته والد باید عدد صحیح باشد').optional(),
        sortOrder: z.number().int('ترتیب نمایش باید عدد صحیح باشد').optional(),
        isActive: z.boolean().optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (parsed.success) {
        client.UpdateCategory(parsed.data, (error: grpc.ServiceError | null, response: UpdateCategoryResponse) => {
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
        client.DeleteCategory(parsed.data, (error: grpc.ServiceError | null, response: DeleteCategoryResponse) => {
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
    client.ListCategories({}, (error: grpc.ServiceError | null, response: ListCategoriesResponse) => {
            if (response) {
                return res.json(response)
            }
            else {
                return res.json(error)
            }
        })
})

export default router