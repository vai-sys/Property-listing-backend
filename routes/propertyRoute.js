const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
    
 deleteProperty ,updateProperty ,getProperty ,getProperties , createProperty

} = require("../controllers/propertyController");


router.get("/", getProperties);
router.get("/:id", getProperty);


router.post("/", auth, createProperty);
router.put("/:id", auth, updateProperty);
router.delete("/:id", auth, deleteProperty);

module.exports = router;
