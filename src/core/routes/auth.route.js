const express = require("express")

const authController = require("../controllers/auth.controller")

const router = express.Router()

router.get("/authenticate", authController.authenticateAction)
router.post("/register", authController.createAction)

module.exports = router
