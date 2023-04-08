import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

async function connect(){
    const mongod =await MongoMemoryServer.create()
    const geturi= mongod.getUri()
    mongoose.set('strictQuery', true);
    const db = await mongoose.connect(geturi)
    console.log("conneced to Database")
    return db
}
export default connect