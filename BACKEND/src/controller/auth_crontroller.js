import user from "../models/User.js"
import jwt from "jsonwebtoken"

export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 charecters" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await user.findOne({email});
    if(existingUser){
      return res.status(400).json({message: "Email already exists"});
    }

    const idx = Math.floor(Math.random() * 100) +1;
    const randomAvator = `https://avatar.iran.liara.run/public/${idx}.png`

    const newUser = await user.create({
      email,
      fullName,
      password,
      profilePic:randomAvator,
    })

    const token = jwt.sign({userId:newUser._id}, process.env.JWT_SECRET_KEY,{
      expiresIn:"7d"
    })

    res.cookie("jwt",token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly:true,
      sameSite:"strict",
      secure : process.env.NODE_ENV === "production"
    })

    res.status(201).json({success:true, user:newUser})

  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({message:"Internal server error"})
    
  }
}

export async function login(req, res) {
 try {
    const { email, password } = req.body;
    if(!email || !password){
      return res.status(400).json({message:"All fields are required"})
    }
    const user = await user.findOne({email});
    if(!user) return res.status(401).json({message:"Invalid email or Password"});

    const isPaswordCorrect = await user.matchPassword(password);
    if(!isPaswordCorrect) return res.status(401).json({message:"Invalid email or Password"})


  } catch (error) {
    
  }
}

export function logout(req, res) {
  
}
