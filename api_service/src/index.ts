import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path';
import { fileURLToPath } from "node:url";
import z from 'zod'
import auth from './routes/auth.routes.js'
import carBrand from './routes/carBrand.routes.js'
import carModel from './routes/carModel.routes.js'
import category from './routes/category.routes.js'
import partBrand from './routes/partBrand.routes.js'
import discount from './routes/discount.routes.js'
import supplier from './routes/supplier.routes.js'
import part from './routes/part.routes.js'
import productImage from './routes/productImage.routes.js'
import partCompatibility from './routes/partCompatibility.routes.js'
import contactMessage from './routes/contactMessage.routes.js'
import banner from './routes/banner.routes.js'
import address from './routes/address.routes.js'
import order from './routes/order.routes.js'
import orderItem from './routes/orderItem.routes.js'
import review from './routes/review.routes.js'
import returnRequest from './routes/returnRequest.routes.js'
import wishlist from './routes/wishlist.routes.js'
import shoppingCart from './routes/shoppingCart.routes.js'
// import express from 'express';
import express, {
    type Request,
    type Response,
    type NextFunction,
} from "express";



const app = express()

const router = express.Router()

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'server is active:)' });
});

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log("recieve")
})
app.use('/auth', auth)
app.use('/car-brands', carBrand)
app.use('/car-models', carModel)
app.use('/categories', category)
app.use('/part-brands', partBrand)
app.use('/discounts', discount)
app.use('/suppliers', supplier)
app.use('/parts', part)
app.use('/product-images', productImage)
app.use('/part-compatibility', partCompatibility)
app.use('/contact-messages', contactMessage)
app.use('/banners', banner)
app.use('/addresses', address)
app.use('/orders', order)
app.use('/order-items', orderItem)
app.use('/reviews', review)
app.use('/return-requests', returnRequest)
app.use('/wishlist', wishlist)
app.use('/shopping-cart', shoppingCart)

app.use(
    (
        err: unknown,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
    ) => {
        console.error(err);
        res.status(500).json({ error: 'خطای داخلی سرور' });
    },
);


const PORT = Number(process.env.RESTPORT) || 3000;
app.listen(PORT, () => {
    console.log(`server start on port ${PORT}`)
})