import mongoose from "mongoose";
import { genSalt, hash } from "bcrypt";

//can add a preference for currecny or budget cycle dates
//googleID as a schema

const UserSchema =  new mongoose.Schema({
    name: {
        type: String, 
        required: true,
    },
    email: {
        type: String,
        required: [true,"email is required"],
        unique: true,
    },
    password:{
        type: String,
        required:[true,"password is required"],
    },
    createdAt: {
        type:Date,
        default: Date.now,
    },
    },
    {
        timestamps: true
    }
);

UserSchema.pre("save", async function(next){
    const salt = await genSalt();
    this.password = await hash(this.password, salt);
    next();
});

const User = mongoose.model("User", UserSchema);

export default User;