import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        msg: "All fields Required",
        success: false,
      });
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        msg: "User Already Exist",
        success: false,
      });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashPass,
    });

    //  CREATE TOKEN
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //  SEND TOKEN + USER
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Server Error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        msg: "All fields Required",
        success: false,
      });
    }

    // ADMIN LOGIN (fixed credentials)
    if (email === "admin@gmail.com" && password === "admin123") {
      const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.json({
        success: true,
        msg: "Admin Login Success",
        user: {
          role: "admin",
          email: "admin@gmail.com",
        },
        token,
      });
    }

    //  NORMAL USER LOGIN
    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(400).json({
        msg: "Invalid Credentials",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, userExist.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: userExist._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.json({
      success: true,
      msg: "Login Success",
      user: {
        id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        role: "user",
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Server Error",
      success: false,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Server Error",
      success: false,
    });
  }
};
