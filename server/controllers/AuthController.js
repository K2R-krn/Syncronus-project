import {response} from "express";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {renameSync, unlinkSync} from "fs";


// Creation of JWT
const maxAge = 3*24*60*60*1000; // Expires in 3 days
const createToken = (email, userId) => {
    return jwt.sign({email,userId}, process.env.JWT_KEY, {
        expiresIn: maxAge
    }) // We telling that - token data = email, userId -- and passing JWT_KEY -- and it expires in 3 days
};

export const signup = async (request, response, next) => {
    try {
        // Write actual logic -> Get email pass form requrest
        const {email, password} = request.body;
        if(!email || !password) {
            return response.status(400).send("Email and Password is required.");
        }
        // If we have email and pass create user
        const user = await User.create({email, password});
        // Now we want to send jwt to user for verification purposes
        // Once token is created return token as cookie
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return response.status(201).json({user:{
            id:user.id,
            email: user.email,
            profileSetup: user.profileSetup,
        }})
    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
}


export const login = async (request, response, next)=> {
    try {
        // Get email and pass
        const {email, password} = request.body;
        if(!email || !password) {
            return response.status(400).send("Email and Password is required.");
        }
        // If we have user existing check
        const user = await User.findOne({email});
        // Check if exist
        if(!user){
            return response.status(404).send("User with the given email not found.");
        }
        // we telling becrypt to compare pass from db and user if they same or not
        const auth  = await bcrypt.compare(password, user.password); 
        if(!auth){
            return response.status(400).send("Password is incorrect.")
        }
        // send coookie
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSites: "None",
        });
        return response.status(200).json({user:{
            id:user.id,
            email: user.email,
            profileSetup: user.profileSetup,
            firstName: user.firstName,
            lastName : user.lastName,
            image: user.image,
            color : user.color,
        }});
    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
};

export const getUserInfo = async (request, response, next)=> {
    try {
        // console.log(request.userId)

        const userData = await User.findById(request.userId);
        if(!userData){
            return response.status(404).send("User with given id not found.");
        }
        return response.status(200).json({
            id:userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName : userData.lastName,
            image: userData.image,
            color : userData.color,
        });
    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
};


export const updateProfile = async (request, response, next)=> {
    try {
        // Grab user id
        const {userId} = request;
        const{firstName, lastName, color} = request.body;
        if(!firstName || !lastName){
            return response.status(400).send("Firstname, Lastname and Color is required.");
        }

        // updateing data
        const userData = await User.findByIdAndUpdate(userId, {
            firstName, lastName, color, profileSetup:true
        }, {new:true, runValidators:true}) // new:true tells mongo db to return new data so we can send to frontend

        // sendiong data to user
        return response.status(200).json({
            id:userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName : userData.lastName,
            image: userData.image,
            color : userData.color,
        });
    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
};



export const addProfileImageController = async (request, response, next)=> {
    try {
        if(!request.file) return response.status(400).send("File is required.");

        const date = Date.now();
        let fileName = `uploads/profiles/${date}-${request.file.originalname}`;
        renameSync(request.file.path, fileName);

        const updatedUser = await User.findByIdAndUpdate(
            request.userId,
            {image : fileName},
            {new: true, runValidators: true}
        );

        // sendiong data to user
        return response.status(200).json({
            image: updatedUser.image
        });
    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
};



export const removeProfileImage = async (request, response, next)=> {
    try {
        // Grab user id
        const user = await User.findById(request.userId);

        if(!user) return response.status(404).send("User not found.");

        if (user.image) {
            try {
              unlinkSync(user.image); // may fail if file is missing
            } catch (error) {
              console.warn("⚠️ Could not delete file:", user.image);
              console.warn(err.message);
            }
        }

        user.image = null;
        await user.save();

        // sendiong data to user
        return response.status(200).send("Profile image removed sucessfully.");
    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
};


export const logout = async (request, response, next)=> {
    try {
        
        response.cookie("jwt", "", {maxAge:1, secure:true, sameSite:"None"});

        return response.status(200).send("Logout sucessfull.");
    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
};
