const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, 
  title: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  areaSqFt: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  amenities: [{ type: String }], 
  furnished: { type: String, enum: ["Unfurnished", "Semi", "Furnished"], required: true },
  availableFrom: { type: Date, required: true },
  listedBy: { type: String, enum: ["Builder", "Owner", "Agent"], required: true },
  tags: [{ type: String }], 
  colorTheme: { type: String },
  rating: { type: Number, min: 0, max: 5 },
  isVerified: { type: Boolean, default: false },
  listingType: { type: String, enum: ["rent", "sale"], required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } 
}, {
  timestamps: true
});

module.exports = mongoose.model("Property", propertySchema);
