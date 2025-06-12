import express from "express"
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController.js"

const router = express.Router()

router.route("/").get(getArticles).post(createArticle)
router.route("/:id").get(getArticleById).put(updateArticle).delete(deleteArticle)

export default router
