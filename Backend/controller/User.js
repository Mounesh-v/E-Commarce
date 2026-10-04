import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const getAdminCredentials = () => ({
  email: process.env.ADMIN_EMAIL || "",
  password: process.env.ADMIN_PASSWORD || "",
});

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        msg: "All fields Required",
        success: false,
      });
    }

    const adminEmail = getAdminCredentials().email;

    if (adminEmail && email.toLowerCase() === adminEmail.toLowerCase()) {
      return res.status(400).json({
        msg: "This email is reserved",
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
        profilePic: newUser.profilePic,
        role: newUser.role,
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

    // ADMIN LOGIN — validated ONLY against env credentials (ADMIN_EMAIL /
    // ADMIN_PASSWORD), never against the database. The db user document is
    // used purely as an identity store so the token id works on protected routes.
    const { email: adminEmail, password: adminPassword } = getAdminCredentials();
    const isAdminEmail =
      adminEmail && email.trim().toLowerCase() === adminEmail.trim().toLowerCase();

    if (isAdminEmail) {
      if (!adminPassword) {
        return res.status(503).json({
          msg: "Admin login is not configured (ADMIN_PASSWORD missing)",
          success: false,
        });
      }

      if (password !== adminPassword) {
        return res.status(401).json({
          msg: "Invalid credentials",
          success: false,
        });
      }

      let adminUser = await User.findOne({ email: adminEmail });

      if (!adminUser) {
        adminUser = await User.create({
          name: "Admin",
          email: adminEmail,
          password: await bcrypt.hash(adminPassword, 10),
          role: "admin",
        });
      } else if (adminUser.role !== "admin") {
        adminUser.role = "admin";
        await adminUser.save();
      }

      const token = jwt.sign(
        { id: adminUser._id, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      return res.json({
        success: true,
        msg: "Admin Login Success",
        user: {
          _id: adminUser._id,
          name: "Admin",
          email: adminEmail,
          profilePic: adminUser.profilePic,
          role: "admin",
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
        _id: userExist._id,
        id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        profilePic: userExist.profilePic,
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
    const user = await User.findById(id).select("-password");
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

export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        msg: "Not authorized",
      });
    }

    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Server Error",
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, profilePic } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        msg: "Not authorized",
      });
    }

    const updates = {};
    if (typeof name === "string") updates.name = name.trim();
    if (typeof profilePic === "string") updates.profilePic = profilePic.trim();

    if (!updates.name) {
      return res.status(400).json({
        success: false,
        msg: "Name is required",
      });
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    return res.status(200).json({
      success: true,
      msg: "Profile updated successfully",
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
