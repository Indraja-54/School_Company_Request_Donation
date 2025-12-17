import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // userId, partyId, userType
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalid" });
  }
};

export const protectSchool = (req, res, next) => {
  console.log("AUTH USER:", req.user);

  if (req.user?.partyType !== "SCHOOL") {
    return res.status(403).json({ message: "School access only" });
  }

  next();
};

export const protectCompany = (req, res, next) => {
  if (req.user?.partyType !== "COMPANY") {
    return res.status(403).json({ message: "Company access only" });
  }
  next();
};




