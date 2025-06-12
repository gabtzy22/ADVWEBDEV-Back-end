import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select("-password")
      next()
    } catch (error) {
      console.error(error)
      res.status(401).json({ message: "Not authorized, token failed" })
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" })
  }
}

export const admin = (req, res, next) => {
  if (req.user && req.user.type === "admin") {
    next()
  } else {
    res.status(401).json({ message: "Not authorized as an admin" })
  }
}

export const editor = (req, res, next) => {
  if (req.user && (req.user.type === "admin" || req.user.type === "editor")) {
    next()
  } else {
    res.status(401).json({ message: "Not authorized as an editor" })
  }
}
