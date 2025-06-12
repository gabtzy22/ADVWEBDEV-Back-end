import express from "express"
import {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").post(registerUser).get(protect, admin, getUsers)

router.post("/login", loginUser)

router.route("/:id").get(protect, getUserById).put(protect, updateUser).delete(protect, admin, deleteUser)

export default router
