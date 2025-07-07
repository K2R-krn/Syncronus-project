import { genSalt, hash } from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true, "Email is Required."],
        unique: true,
    },
    password:{
        type:String,
        required:[true, "Password is Required."],
    },
    firstName:{
        type:String,
        required:false,
    },
    lastName:{
        type:String,
        required:false,
    },
    image:{
        type:String,
        required:false,
    },
    color:{
        type:Number,
        required:false,
    },
    profileSetup:{ // Basically check to see if profile setup done or no atleast email and pass..
        type:Boolean,
        default:false,
    }
});

// As soon as we save profile we need to encrypt the password..
userSchema.pre("save", async function(next){ // There are 2 type of middlewares - pre - post
    const salt = await genSalt(); // salt is basically method of encryption
    this.password = await hash(this.password, salt);
    next(); // next tells server that this part is completed and go ahead and call next funciton..
});

const User = mongoose.model("Users", userSchema);

export default User;