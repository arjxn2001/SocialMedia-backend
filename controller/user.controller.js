import User from "../models/user.model.js";
import Follow from "../models/follow.model.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// register

export const registerUser = async (req,res)=>{
    const {userName, displayName, email, password} = req.body;

    if(!userName || !email || !password){
        return res.status(400).json({message: "All fields are required!"});

    }

    const newHashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        userName,
        displayName,
        email,
        hashedPassword:newHashedPassword,
    });

    // cookies
    const token = jwt.sign({userId: user._id}, "arjun12345")

    res.cookie("access_token", token, {
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        maxAge: 30 * 24* 60 * 60 * 100,
    })


    const {hashedPassword, ...detailsWithoutPassword}= user.toObject();

    res.status(201).json(detailsWithoutPassword);
}


// login

export const loginUser = async (req,res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(401).json({message: "All fields are required!"});
    }

    const user = await User.findOne({email})

    if(!user){
        return res.status(401).json({message: "Invalid email or password"});
    }


    const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword)

    if(!isPasswordCorrect){
        return res.status(401).json({message: "Invalid email or password"});
    }


    // cookies
    const token = jwt.sign({userId: user._id}, "arjun12345")

    res.cookie("access_token", token, {
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        maxAge: 30 * 24* 60 * 60 * 100,
    })

    const {hashedPassword, ...detailsWithoutPassword}= user.toObject();

    res.status(201).json(detailsWithoutPassword);
}




// logout

export const logoutUser = async (req,res)=>{

    res.clearCookie("token")

    res.status(200).json({message: "Logout successful"});
    
}


export const getUser = async (req, res) => {
    try {
      const { userName } = req.params;
  
      const user = await User.findOne({ userName });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const { hashedPassword, ...detailsWithoutPassword } = user.toObject();
  
      const followerCount = await Follow.countDocuments({ following: user._id });
      const followingCount = await Follow.countDocuments({ follower: user._id });
  
      const token = req.cookies.access_token;
  
      if (!token) {
        return res.status(200).json({
          ...detailsWithoutPassword,
          followerCount,
          followingCount,
          isFollowing: false,
        });
      }
  
      jwt.verify(token, "arjun12345", async (err, payload) => {
        if (err) {
          return res.status(200).json({
            ...detailsWithoutPassword,
            followerCount,
            followingCount,
            isFollowing: false,
          });
        }
  
        const isExists = await Follow.exists({
          follower: payload.userId,
          following: user._id,
        });
  
        res.status(200).json({
          ...detailsWithoutPassword,
          followerCount,
          followingCount,
          isFollowing: isExists ? true : false,
        });
      });
    } catch (err) {
      console.error("getUser error:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

//follows

export const followUser = async (req,res)=>{
    const {userName} = req.params

    const user = await User.findOne({userName})

    const isFollowing = await Follow.exists({
        follower: req.userId,
        following: user._id,
    });

    if(isFollowing){
        await Follow.deleteOne({follower: req.userId, following: user._id,});
    }else{
        await Follow.create({follower: req.userId, following: user._id,});  
    }


    res.status(200).json({message:"Successful"});
}