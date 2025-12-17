
import { comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import UserLogin from "@/models/UserLogin.js"

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserLogin.findOne({ loginName: email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.json({
      token,
      userType: user.userType,
      partyId: user.partyId
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
