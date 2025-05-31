const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
    
 removeFavorite, getFavorites ,addFavorite
} = require("../controllers/favoriteController");


router.use(auth);

router.post("/",addFavorite);               
router.get("/",getFavorites);               
router.delete("/:propertyId", removeFavorite); 

module.exports = router;
