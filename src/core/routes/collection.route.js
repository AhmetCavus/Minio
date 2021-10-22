const express = require("express")

const controller = require("../controllers/collection.controller")

const router = express.Router()

router.get("/:schema/populated", controller.getPopulatedCollection)
router.get("/:schema", controller.getCollection)
router.get("/:schema/:id", controller.getCollectionItem)
router.get("/:schema/:id/populated", controller.getPopulatedCollectionItem)
router.put("/:schema", controller.updateCollection)
router.post("/:schema", controller.addCollectionItem)
router.put("/:schema/:id", controller.updateCollectItem)
router.delete("/:schema/:id", controller.removeCollectionItem)

module.exports = router
