const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    ingredients: [{ type: String }],
    instructions: { type: String, required: true },
    taste: { type: String },
    reviews: { type: Number },
    cuisineType: { type: String },
    preparationTime: { type: Number }
  });
  
module.exports = mongoose.model('Recipe', recipeSchema);