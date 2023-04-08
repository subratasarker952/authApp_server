import mongoose from "mongoose";

export const UserSchema=new mongoose.Schema({
    userName:{
        type:String,
        required: [true, 'userName required'],
        unique: [true, 'Must be unique'],
    },
    email:{
        type:String,
        required: [true, 'userName required'],
        unique: [true, 'Must be unique'],
    },
    password:{
        type:String,
        required: [true, 'userName required'],
        unique: false,
    },
    firstName:{type:String},
    lastName:{type:String},
    profile:{type:String},
    address:{type:String},
    phone:{type:Number},
})


export default mongoose.model.Users || mongoose.model('User', UserSchema)