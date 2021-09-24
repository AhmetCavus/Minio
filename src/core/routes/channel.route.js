const express = require("express")

const channelController = require("../controllers/channel.controller")

const router = express.Router()

router.post("/:channelId", channelController.createChannelAction)
router.get("/", channelController.getChannelsAction)

module.exports = router
