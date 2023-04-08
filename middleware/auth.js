import jwt from 'jsonwebtoken'
import ENV from '../config.js'

// const { ENV } = '../config.js'


export default async function Auth(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, ENV.jwt_secret)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).send({ error })
    }
}
export function localVariables(req, res, next) {
    req.app.locals = {
        otp: null,
        resetSession: false
    }
    next()
}