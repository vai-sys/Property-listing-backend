const Property = require("../models/Property");
const mongoose = require("mongoose");
const redisClient = require("../config/redis");
const crypto = require("crypto");


const createProperty = async (req, res) => {
  try {
    const data = req.body;
    data.amenities = data.amenities?.split("|");
    data.tags = data.tags?.split("|");
    data.createdBy = req.userId;

    const property = await Property.create(data);
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};






const getCacheKey = (queryObj) => {
  const str = JSON.stringify(queryObj);
  return "props:" + crypto.createHash("md5").update(str).digest("hex");
};

const getProperties = async (req, res) => {
  try {
    const query = { ...req.query };
    const cacheKey = getCacheKey(query);

    const cached = await redisClient.get(cacheKey);
    console.log("cached value:", cached, typeof cached);

    if (cached) {
     
      return res.json({ fromCache: true, data: cached });
    }

    if (query.amenities) {
      query.amenities = { $all: query.amenities.split(",") };
    }
    if (query.tags) {
      query.tags = { $all: query.tags.split(",") };
    }

    const properties = await Property.find(query);

   
    await redisClient.setex(cacheKey, 300, JSON.stringify(properties));

    res.json({ fromCache: false, data: properties });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: "Not found" });
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const updateProperty = async (req, res) => {
  try {
   
    if (!req.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }


    const property = await Property.findById(req.params.id);
  
    if (!property) return res.status(404).json({ error: "Not found" });
    
    // if (property.createdBy?.toString() !== req.userId.toString()) {
    //   return res.status(403).json({ error: "Unauthorized" });
    // }

   

    const updates = { ...req.body };
    
    if (updates.amenities && typeof updates.amenities === 'string') {
      updates.amenities = updates.amenities.split("|").filter(item => item.trim());
    }
    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split("|").filter(item => item.trim());
    }

    delete updates.id;
    delete updates.createdBy;
    delete updates.createdAt;
    delete updates.updatedAt;
   

    const updated = await Property.findByIdAndUpdate(
      req.params.id, 
      updates, 
      { 
        new: true,
        runValidators: true
      }
    );
  
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: "Not found" });
    // if (property.createdBy.toString() !== req.userId)
    //   return res.status(403).json({ error: "Unauthorized" });

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Property deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports={
    deleteProperty ,updateProperty ,getProperty ,getProperties , createProperty
}