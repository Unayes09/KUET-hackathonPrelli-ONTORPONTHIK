// routes/route.js
const express = require('express');
const router = express.Router();

const ingredientController = require('../controllers/ingredientController');
const recipeController = require('../controllers/recipeController');
const chatbotController = require('../controllers/chatbotController');

// Ingredient Routes
router.post('/ingredients', ingredientController.addIngredient);
router.put('/ingredients/:id', ingredientController.updateIngredient);

// Recipe Routes
router.post('/recipes', recipeController.addRecipe);
router.post('/recipeFile',chatbotController.addRecipeFromFile)
router.post('/recipeImage',chatbotController.addRecipeFromImage)
// Add a route for parsing recipes from a file if needed

// Chatbot Route
router.post('/chat', chatbotController.chatbotInteraction);

module.exports = router;