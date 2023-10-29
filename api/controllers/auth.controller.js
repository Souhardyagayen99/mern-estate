import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if a user with the same username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      const errors = {};
      if (existingUser.username === username) {
        errors.username = "Username is already taken.";
      }
      if (existingUser.email === email) {
        errors.email = "Email is already taken.";
      }
      return res.status(409).json({ errors });
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create a new User instance with the hashed password
    const newUser = new User({ username, email, password: hashedPassword }); // Use "password" instead of "hashedPassword"

    // Save the user to the database
    await newUser.save();

    res.status(201).json("User created successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
