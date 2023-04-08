import UserModel from '../model/User.model.js'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import otpGenarator from 'otp-generator'
import ENV from '../config.js'


//middlewer for veryfy user
export async function verifyUser(req, res, next) {
     try {
          const { userName } = req.method == 'GET' ? req.query : req.body
          //check user exists
          let user = await UserModel.findOne({ userName })
          if (!user) return res.status(404).send({ error: "can not find User" })
          next()
     } catch (error) {
          return res.status(404).send({ error: "Authentication error" })
     }
}

export async function register(req, res) {
     try {

          const { userName, email, password, profile, address, phone, firstName, lastName } = req.body;
          // res.send( {userName,  email, password, firstName,})

          //check user
          const existUserName = new Promise((resolve, reject) => {
               UserModel.findOne({ userName }, function (err, user) {
                    if (err) reject(new Error(err))
                    if (user) reject({ error: "User Name must unique" })
                    resolve()
               })
          })
          //check existing email
          const existEmail = new Promise((resolve, reject) => {
               UserModel.findOne({ email }, function (err, user) {
                    if (err) reject(new Error(err))
                    if (user) reject({ error: "Email exists" })
                    resolve()
               })
          })
          Promise.all([existUserName, existEmail])
               .then(() => {
                    if (password) {
                         bcrypt.hash(password, 10)
                              .then(hashPassword => {
                                   const user = new UserModel({
                                        userName,
                                        email,
                                        password: hashPassword,
                                        profile: profile || '',
                                        firstName: firstName || '',
                                        lastName: lastName || ''
                                   })
                                   user.save()
                                        .then(result => res.status(201).send({ msg: "user save susscssful" }))
                                        .catch(error => {
                                             res.status(500).send(error)
                                        })
                              })
                              .catch(error => {
                                   return res.status(500).send({ error: "Error due to hash password generate" })
                              })
                    }

               }).catch(error => {
                    return res.status(500).send({ error })
               })
     } catch (error) {
          res.status(500).send(error)
     }

}

export async function registerMail(req, res) {
     res.json('hello from registermail')
}
export async function authenticate(req, res) {
     res.end()
}
export async function login(req, res) {
     try {

          const { userName, password } = req.body;
          // res.send( {userName,  email, password, firstName,})
          //check user
          const user = await UserModel.findOne({ userName })
          if (!user) res.status(404).send({ error: "username not found" })

          const matchPassword = await bcrypt.compare(password, user.password)

          if (!matchPassword) return res.status(400).send({ error: "Password mismatch" })

          const token = jwt.sign({ userId: user._id, userName: user.userName }, ENV.jwt_secret, { expiresIn: "24h" })

          return res.status(200).send({
               meg: "Login Successful",
               userName: user.userName,
               token
          })

     } catch (error) {
          res.status(500).send(error)
     }
}

export async function getUserByEmail(req, res) {
     const { userName } = req.params
     try {
          if (!userName) return res.status(504).send({ error: "invalid user name" })
          const user = await UserModel.findOne({ userName: userName })
          if (!user) return res.status(501).send({ error: "could not find user" })
          const { password, ...rest } = user._doc
          return res.status(201).send({ rest })

     } catch (error) {
          return res.status(404).send({ error: "can not find user data" })
     }
}
export async function generateOTP(req, res) {
     try {
          req.app.locals.otp = await otpGenarator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })
          return res.status(201).send({ code: req.app.locals.otp })
     } catch (error) {
          return res.status(401).send({ error: "error code generate" })
     }
}

export async function verifyOTP(req, res) {
     try {
          const { code } = req.query

          if (!req.app.locals.otp) {
               return res.status(400).send({ error: "invalid otp" })
          }
          if (parseInt(req.app.locals.otp) === parseInt(code)) {
               req.app.locals.otp = null,
                    req.app.locals.resetSession = true,
                    res.status(200).send({ msg: 'verify successful' })
          }


     } catch (error) {

          return res.status(400).send({ error: "invalid otp" })
     }
}

export async function createResetSession(req, res) {
     try {
          if (req.app.locals.resetSession) {
               // req.app.locals.resetSession = false
               return res.status(201).send({ flag: req.app.locals.resetSession })
          }

     } catch (error) {

          return res.status(404).send({ error: "Session expired" })
     }
}

export async function updateUser(req, res) {
     try {
          // const userId = req.query.id;

          const { userId } = req.user
          if (userId) {
               const body = req.body;
               const result = await UserModel.updateOne({ _id: userId }, body)
               return res.status(201).send({ result })

          }
          return res.status(401).send({ error: "user not found" })



     } catch (error) {
          return res.status(401).send({ error })
     }
}

export async function resetPassword(req, res) {
     const { userName, password } = req.body;

     try {
          if (!req.app.locals.resetSession) return res.status(404).send({ error: "Session expired" })
          try {

               UserModel.findOne({ userName })
                    .then(user => {
                         bcrypt.hash(password, 10)
                              .then(hashPassword => {
                                   UserModel.updateOne({ userName: user.userName }, { password: hashPassword }, function (err, data) {
                                        if (err) throw err;
                                        req.app.locals.resetSession = false
                                        return res.status(201).send({ meg: "record update" })
                                   })

                              })
                              .catch(error => {
                                   return res.status(500).send({ error })
                              })
                    })
                    .catch(error => {
                         return res.status(404).send({ error })
                    })

          } catch (error) {
               return res.status(401).send({ error })
          }

     } catch (error) {
          return res.status(401).send({ error })
     }
}