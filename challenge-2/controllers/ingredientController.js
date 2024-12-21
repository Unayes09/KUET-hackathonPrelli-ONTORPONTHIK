const Ingredient = require('../models/Ingredient');

// Add a new ingredient
exports.addIngredient = async (req, res) => {
  try {
    const ingredient = new Ingredient(req.body);
    await ingredient.save();
    res.status(201).json(ingredient);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Update an ingredient
exports.updateIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ingredient) return res.status(404).json({ message: "Ingredient Not Found" });
    res.json(ingredient);
  } catch (error) {
    res.status(400).json(error);
  }
};