import Article from "../models/Article.js"

export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 })
    res.json(articles)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
    if (!article) {
      return res.status(404).json({ message: "Article not found" })
    }
    res.json(article)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createArticle = async (req, res) => {
  try {
    const { title, content, author, category, tags } = req.body
    const newArticle = new Article({
      title,
      content,
      author,
      category,
      tags: tags || [],
      isActive: true,
      views: 0,
    })
    await newArticle.save()
    res.status(201).json(newArticle)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!article) return res.status(404).json({ message: "Article not found" })
    res.json(article)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id)
    if (!article) return res.status(404).json({ message: "Article not found" })
    res.json({ message: "Article deleted successfully" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
