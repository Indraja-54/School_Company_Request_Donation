import UserLogin from "../models/UserLogin.js";
import Party from "../models/Party.js";
import Address from "../models/Address.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../util/sendEmail.js";
import { randomBytes } from "node:crypto";

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      userType: user.userType,
      partyId: user.partyId,
      partyType: user.userType
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const {
      email,
      password,
      partyType,
      name,
      contactName,
      contactPhone,
      contactEmail,
      address,
    } = req.body;

    // Check user exists
    const userExists = await UserLogin.findOne({ loginName: email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create address
    const newAddress = await Address.create(address);

    // Create party
    const party = await Party.create({
      partyType,
      name,
      addressId: newAddress._id,
      contactName,
      contactPhone,
      contactEmail,
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create login
    await UserLogin.create({
      loginName: email,
      password: hashedPassword,
      userType: partyType,
      partyId: party._id,
    });

    res.status(201).json({ message: "Registration successful" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserLogin.findOne({ loginName: email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const party = await Party.findById(user.partyId).select("name");

    const token = generateToken(user);

    res.json({
      token,
      userType: user.userType,
      partyId: user.partyId,
      partyName: party?.name,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserLogin.findOne({ loginName: email });
    if (!user) {
      return res.status(404).json({ message: "Email not registered" });
    }

    // ✅ Generate temp password
    const tempPassword = randomBytes(4).toString("hex");

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // ✅ Save to DB
    user.password = hashedPassword;
    await user.save();

    // ✅ Send email
    await sendEmail(
      email,
      "Temporary Password",
      `Your temporary password is: ${tempPassword}\nPlease login and change it immediately.`
    );

    res.json({ message: "Temporary password sent to your email" });

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// LOGOUT
export const logoutUser = async (req, res) => {
  try {
    // 🔥 For JWT-based auth (stored in frontend),
    // logout = client deletes token.
    // Backend just responds OK.

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

