const Favorite = require("../models/Favorite");
const Property = require("../models/Property");


const addFavorite = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: "Property not found" });

    const fav = await Favorite.create({ user: req.userId, property: propertyId });
    res.status(201).json(fav);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already favorited" });
    }
    res.status(500).json({ error: err.message });
  }
};


const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.userId }).populate("property");
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const removeFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;
    await Favorite.findOneAndDelete({ user: req.userId, property: propertyId });
    res.json({ message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports={
    removeFavorite, getFavorites ,addFavorite
}
