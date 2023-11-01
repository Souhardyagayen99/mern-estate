import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken';


export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  // Hash the password
  const hashedPassword = bcryptjs.hashSync(password, 10);
  // Create a new User instance with the hashed password
  const newUser = new User({ username, email, password: hashedPassword }); // Use "password" instead of "hashedPassword"

  try {
    // -------------------------You can Uncomment this code---------------------------------------
    // // Check if a user with the same username or email already exists
    // const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    // if (existingUser) {
    //   const errors = {};
    //   if (existingUser.username === username) {
    //     errors.username = "Username is already taken.";
    //   }
    //   if (existingUser.email === email) {
    //     errors.email = "Email is already taken.";
    //   }
    //   return res.status(409).json({ errors });
    // }
    // ----------------------------------------------------------------

    // Save the user to the database
    await newUser.save();
    res.status(201).json("User created successfully!");
  } catch (error) {
    console.error(error);
    //res.status(500).json(error.message);
    next(error);
  }
};

export const signin = async (req, res, next) => { 
  const { email, password } = req.body;
  try{
    const validUser = await User.findOne({ email: email});
    if(!validUser) return next(errorHandler(404, 'User not found!'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if(!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
    const token = jwt.sign({id: validUser._id }, process.env.JWT_SECRET)
    const { password: pass, ...rest } = validUser._doc;
    res.cookie('access_token', token, { httpOnly: true}).status(200).json(rest);
  }
  catch(error) {
    next(error);
  }
}