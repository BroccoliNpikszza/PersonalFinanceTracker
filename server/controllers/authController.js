import { compare } from "bcrypt";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';

const maxAge = 3 * 24 * 60 * 60 * 1000 // 3 days

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = (email, userId) => {
    return jwt.sign((email, userId), process.env.JWT_KEY, {
        expiresIn: maxAge,
    })
}

export const signup = async (req, res, next) => {
    try{
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).send("Email and Password are required");
        }

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(409).send("User already exists");
        }

        const user = await User.create({email, password});
        res.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite:"None",
        });
        return res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            },
        });
    }catch(error){
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

export const login = async (req, res, next) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).send("Email and Password are required");
        }
        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).send("Invalid Credentials");
        }
        const auth = await compare(password, user.password);
        if(!auth){
            return res.status(400).send("Incorrect Password");
        }
        res.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure:true,
            sameSite:"None",
        });
        return res.status(200).json({
            user:{
                id:user.id,
                email:user.email,
                profileSetup:user.profileSetup,
            },
        });
    }catch(error){
        console.log(error);
        return res.status(500).send("Internal Sever Error");
    }
}

export const getUserInfo = async (req, res, next) => {
    try{
        const userData = await User.findById(req.userId);
        if(!userData){
            return res.status(404).send("User not found");
        }
        return res.status(200).json({
            id:userData.id,
            email:userData.email,
            profileSetup:userData.profileSetup,
            firstname:userData.firstname,
            lastname:userData.lastname,
            image:userData.image,
            color:userData.color,
        });
    } catch(error){
        console.log(error);
        return res.status(500).send("Internal Sever Error");
    }
}

export const updateProfile = async (req, res ,next) => {
    try {
        const {userId} = req;
        const {firstname, lastname, color} = req.body;
        if (!firstname || !lastname ) {
            return res
            .status(400)
            .send("First name, last name and color are required");
        }
        const userData = await User.findByIdAndUpdate(
            userId, 
        {
            firstname,
            lastname,
            color,
            profileSetup: true,
        }, {new: true, runValidators: true});
        return res.status(200).json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstname: userData.firstname,
            lastname: userData.lastname,
            image: userData.image,
            color: userData.color,
        });
    } catch (error) {
        console.log({error});
        return res.status(500).send("Internal server error");
    }
}

export const addProfileImage = async (req, res ,next) => {
    try {
        if(!req.file) {
            return res.status(400).send("Image is required");
        }
        const date = Date.now();
        const fileName = "uploads/profiles/"+date+req.file.originalname;
        renameSync(req.file.path, fileName);

        const updatedUser = await User.findByIdAndUpdate(
            req.userId, 
            {image: fileName}, 
            {new: true, runValidators: true}
        );
        
        return res.status(200).json({
            image: updatedUser.image,
        });
    } catch (error) {
        console.log({error});
        return res.status(500).send("Internal server error");
    }
}

export const removeProfileImage = async (req, res ,next) => {
    try {
        const {userId} = req;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        if (!user.image) {
            unlinkSync(user.image);
        }
        user.image = null;
        await user.save();
        return res.status(200).send("Image removed successfully");
    } catch (error) {
        console.log({error});
        return res.status(500).send("Internal server error");
    }
}

export const logout = async (req, res ,next) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 1,
            secure:true,
            sameSite:"None",
        });
        return res.status(200).send("Logged out successfully");
    } catch (error) {
        console.log({error});
        return res.status(500).send("Internal server error");
    }
}

export const googleAuth = async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { email, sub: googleId } = ticket.getPayload();
        let user = await User.findOne({ googleId });
        if (!user) {
            user = await User.create({ email, googleId });
        }
        res.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
};
