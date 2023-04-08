import { Router } from "express";
import * as controller from "../controller/authController.js";
import { registerMail } from "../controller/mailer.js";

import Auth, { localVariables } from "../middleware/auth.js";

const router = Router()

//user register
router.route('/register').post(controller.register)

//register mail sent
router.route('/registerMail').post(registerMail)

// authenticate user
router.route('/authenticate').post(controller.verifyUser, controller.authenticate)
//login in app
router.route('/login').post(controller.verifyUser, controller.login)

// get method
//get user by email
router.route('/user/:userName').get(controller.getUserByEmail)

//genarateRandom otp
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP)

//generated Random otp verify
router.route('/verifyOTP').get(controller.verifyOTP)

//
router.route('/createResetSession').get(controller.createResetSession)

//put requiest
//update profile
router.route('/updateuser').put(Auth, controller.updateUser)
//update password
router.route('/resetpassword').put(controller.verifyUser, controller.resetPassword)


export default router