const express = require("express")

const todoController = require("../controllers/todo.controller")

const router = express.Router()

router.get("/", todoController.todos)
router.post("/", todoController.create)

module.exports = router
