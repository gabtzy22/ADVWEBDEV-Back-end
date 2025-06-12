import User from "../models/User.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  })
}

// @desc    Register new user
// @route   POST /api/users
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, age, gender, contactNumber, email, username, password, address, type } = req.body

    // Check if user exists
    const userExists = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (userExists) {
      return res.status(400).json({
        message: "User with this email or username already exists",
      })
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      age,
      gender,
      contactNumber,
      email,
      username,
      password,
      address,
      type: type || "viewer",
    })

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        type: user.type,
        token: generateToken(user._id),
      })
    } else {
      res.status(400).json({ message: "Invalid user data" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    console.log("Login attempt for:", email)

    // Check for user email
    const user = await User.findOne({ email })

    if (!user) {
      console.log("User not found")
      return res.status(401).json({ message: "Invalid email or password" })
    }

    console.log("User found:", user.email)
    console.log("Stored password:", user.password)
    console.log("Input password:", password)

    // Check if password is already hashed (starts with $2a$ or $2b$)
    const isPasswordHashed = user.password.startsWith("$2a$") || user.password.startsWith("$2b$")

    let passwordMatch = false

    if (isPasswordHashed) {
      // Password is hashed, use bcrypt compare
      passwordMatch = await bcrypt.compare(password, user.password)
      console.log("Using bcrypt compare, match:", passwordMatch)
    } else {
      // Password is plain text, do direct comparison
      passwordMatch = password === user.password
      console.log("Using direct compare, match:", passwordMatch)

      // If login is successful with plain text, hash the password for future use
      if (passwordMatch) {
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.findByIdAndUpdate(user._id, { password: hashedPassword })
        console.log("Password hashed and updated in database")
      }
    }

    if (passwordMatch) {
      console.log("Login successful")
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        type: user.type,
        token: generateToken(user._id),
      })
    } else {
      console.log("Password mismatch")
      res.status(401).json({ message: "Invalid email or password" })
    }
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password")
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (user) {
      user.firstName = req.body.firstName || user.firstName
      user.lastName = req.body.lastName || user.lastName
      user.age = req.body.age || user.age
      user.gender = req.body.gender || user.gender
      user.contactNumber = req.body.contactNumber || user.contactNumber
      user.email = req.body.email || user.email
      user.username = req.body.username || user.username
      user.address = req.body.address || user.address
      user.type = req.body.type || user.type
      user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive

      if (req.body.password) {
        user.password = req.body.password
      }

      const updatedUser = await user.save()

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        type: updatedUser.type,
        isActive: updatedUser.isActive,
      })
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (user) {
      await User.findByIdAndDelete(req.params.id)
      res.json({ message: "User removed" })
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
