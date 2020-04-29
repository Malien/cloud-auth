import { sign, verify as verifyBase } from "jsonwebtoken"
import { Credentials } from "@prisma/client";

export type Payload = Pick<Credentials, "id" | "login" | "tokenRevision">

const generate = (user: Payload, key: string, expiresIn?: number | string) =>
    new Promise<string>((resolve, reject) => sign(user, key, { expiresIn }, (err, res) => {
        if (err) reject(err)
        else resolve(res)
    }))

const verify = (token: string, key: string) => new Promise<object>((resolve, reject) => verifyBase(token, key, (err, res) => {
    if (err) reject(err)
    else resolve(res)
}))

export const generateAccessToken = (user: Payload) => generate(user, process.env.ACCESS_TOKEN_SECRET!, "2m")

export const generateRefreshToken = (user: Payload) => generate(user, process.env.REFRESH_TOKEN_SECRET!, "30s")

export const verifyAccessToken = <T extends object>(token: string): Promise<T> => verify(token, process.env.ACCESS_TOKEN_SECRET!) as any

export const verifyRefreshToken = <T extends object>(token: string): Promise<T> => verify(token, process.env.REFRESH_TOKEN_SECRET!) as any
