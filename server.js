import express from "express";
import cors from "cors"
import morgan from "morgan";
import connect from "./database/connection.js";
import router from "./Router/router.js";

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use('/api', router)
app.disable('x-powered-by')


const port = 8080
app.get('/', (req, res) => {
    res.status(201).json("what do you want this is home")
})

// api route
app.use('/api', router)



connect().then(() => {
    try {
        app.listen(port, () => {
            console.log("server is running")
        })
    } catch (error) {
        console.log("cannot connect to te db")
    }
}).catch((error) => {
    console.log("invalid db connection")
})

