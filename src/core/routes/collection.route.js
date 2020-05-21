const express = require("express")

const controller = require("../controllers/collection.controller")

const router = express.Router()

router.get("/:schema/:relations", controller.getCollection)
router.get("/:schema", controller.getCollection)
router.put("/:schema", controller.updateCollection)
router.post("/:schema", controller.addCollectionItem)
router.put("/:schema/:id", controller.updateCollectItem)
router.delete("/:schema/:id", controller.removeCollectionItem)

module.exports = router
