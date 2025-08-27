import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password, profilePic } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ Error: "All fields are required." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ Error: "Password must be atleast 6 characters" });
    }
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ Error: "User already exists." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName: fullName,
      email: email,
      profilePic: profilePic,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        fullName: fullName,
        email: email,
        password: hashedPassword,
        profilePic: profilePic,
      });
      await newUser.save();
    } else {
      return res.status(400).json({ Error: "Invalid user data." });
    }
  } catch (err) {
    res.status(500).json({ Error: "Error to create user" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ Error: "inavlid credentials." });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ Error: "invalid credentials" });
    }
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      password: user.password,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error to login user", error.message);
    res.status(500).json({ Error: "Error to login user." });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("UserToken", "", {
      maxAge: 0,
    });
    res.status(200).json({ message: "logged out successfuly" });
  } catch (error) {
    console.error("Error to logout user", error.message);
    res.status(500).json({ Error: "internal server error." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ Error: "No ProfilePic provided." });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true})
    res.status(200).json(updatedUser)
  } catch (error) {
    console.error("error to update user", error.message)
    res.status(500).json({Error: "internal server error"})
  }
};

export const checkAuth = (req, res)=>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.error("Error in checkAuth", error.message)
        res.status(500).json({Error: "internal server error."})
    }
}