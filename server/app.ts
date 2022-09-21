require('dotenv').config()
// es modules
import express, { ErrorRequestHandler } from "express";
require('express-async-errors');
import bcryptjs from "bcryptjs";
import { number, z, ZodError } from "zod";
import { db } from "./db";
import { Prisma } from "@prisma/client";
import createHttpError, { HttpError } from "http-errors";
import { JsonWebTokenError } from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { checkRole, checkSession, createSession } from "./auth";

const app = express()
app.use(express.json())
app.use(cookieParser())

app.post('/api/users/signup', async (req, res, next) => {
    const User = z.object({
        name: z.string().optional(),
        email: z.string().email(),
        password: z.string(),
    });
    const user = await User.parseAsync(req.body)
    const userFromDb = await db.user.create({
        data: {
            name: user.name || null,
            email: user.email,
            passwordHash: await bcryptjs.hash(user.password, 10),
        },
        select: {
            email: true,
            name: true,
            id: true,
        }
    })
    res.send(userFromDb)
})

app.post('/api/users/login', async (req, res) => {
    const User = z.object({
        email: z.string().email(),
        password: z.string(),
    });
    const user = User.parse(req.body)
    const userFromDb = await db.user.findUnique({
        where: {
            email: user.email
        }
    })
    if (userFromDb) {
        if (await bcryptjs.compare(user.password, userFromDb.passwordHash)) {
            const session = await createSession(res, userFromDb.id)
            return res.send({ status: "Successful" })
        }
    }
    throw new createHttpError.Unauthorized('Wrong user\'s credentials')
})

app.post('/api/products',
    checkSession,
    checkRole('ADMIN'),
    async (req, res) => {
        const Product = z.object({
            name: z.string(),
            price: z.number()
        })
        const product = await Product.parseAsync(req.body)
        const newProduct = await db.product.create({
            data: product
        })
        return res.send(newProduct)
    })

app.get('/api/products', async (req, res) => {
    const products = await db.product.findMany()
    res.send(products)
})

app.post('/api/carts', checkSession, async (req, res, next) => {
    if (!req.user) return;
    const Product = z.object({
        id: z.number(),
        quantity: z.number().default(1),
    })
    const product = Product.parse(req.body)
    const productFromDB = await db.product.findUnique({
        where: {
            id: product.id
        }
    })

    if (!productFromDB) throw new createHttpError.BadRequest('Wrong product ID') 

    const cart = await db.cart.findUnique({
        where: {
            userId_productId: {
                productId: product.id,
                userId: req.user.id
            }
        }
    })
    if (cart) {
        await db.cart.update({
            where: {
                userId_productId: {
                    productId: product.id,
                    userId: req.user.id
                },
            },
            data: {
                quantity: cart.quantity + product.quantity
            }
        })
    } else {
        const newCart = await db.cart.create({
            data: {
                quantity: 1,
                productId: product.id,
                userId: req.user.id
            }
        })
    }
})

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof ZodError) res.status(400)
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') res.status(409)
    }
    if (err instanceof JsonWebTokenError) res.status(403)
    if (err instanceof HttpError) res.status(err.status)
    console.error(err)
    res.send(err)
}

app.use(errorHandler)

app.listen(4000)