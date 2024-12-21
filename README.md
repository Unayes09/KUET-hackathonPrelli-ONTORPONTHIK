# API Documentation

Welcome to the API documentation for our kitchen assistant application. This API allows you to manage ingredients, add recipes from various sources, and interact with a chatbot for recipe suggestions.

## Table of Contents

- [Ingredient Routes](#ingredient-routes)
  - [Add Ingredient](#add-ingredient)
  - [Update Ingredient](#update-ingredient)
- [Recipe Routes](#recipe-routes)
  - [Add Recipe](#add-recipe)
  - [Add Recipe from File](#add-recipe-from-file)
  - [Add Recipe from Image](#add-recipe-from-image)
- [Chatbot Route](#chatbot-route)
  - [Chatbot Interaction](#chatbot-interaction)
- [Notes](#notes)

## Ingredient Routes

### Add Ingredient

- **Route**: `/ingredients`
- **Method**: POST
- **Description**: Adds a new ingredient to the database.
- **Sample Payload**:
  ```json
  {
    "name": "Tomato",
    "quantity": 5,
    "unit": "pieces"
  }
  ```

- **Sample Response**:
  ```json
  {
  "message": "Ingredient added successfully",
  "ingredient": {
    "id": "ingredient_id_123",
    "name": "Tomato",
    "quantity": 5,
    "unit": "pieces"
    }
  }
  ```

### Update Ingredient

- **Route**: `/ingredients/:id`
- **Method**: PUT
- **Description**: Upadates an ingredient to the database.
- **Sample Payload**:
  ```json
  {
    "name": "Tomato",
    "quantity": 10,
    "unit": "pieces"
  }
  ```

- **Sample Response**:
  ```json
  {
  "message": "Ingredient updated successfully",
  "ingredient": {
    "id": "ingredient_id_123",
    "name": "Tomato",
    "quantity": 10,
    "unit": "pieces"
    }
  }
  ```

  ### Add Recipe

- **Route**: `/recipes`
- **Method**: POST
- **Description**: Adds a new recipe to the database.
- **Sample Payload**:
  ```json
  {
  "title": "Tomato Soup",
  "ingredients": ["ingredient_id_1", "ingredient_id_2"],
  "instructions": "Chop tomatoes and cook with spices.",
  "taste": "Savory",
  "reviews": 5,
  "cuisineType": "Italian",
  "preparationTime": 30
  }
  ```

- **Sample Response**:
  ```json
  {
  "message": "Recipe added successfully",
  "recipe": {
    "id": "recipe_id_456",
    "title": "Tomato Soup",
    "ingredients": ["ingredient_id_1", "ingredient_id_2"],
    "instructions": "Chop tomatoes and cook with spices.",
    "taste": "Savory",
    "reviews": 5,
    "cuisineType": "Italian",
    "preparationTime": 30
    }
  }
  ```

### Add Recipe from File

- **Route**: `/recipeFile`
- **Method**: POST
- **Description**: Processes a text file containing recipe details and adds the recipe to the database.
- **Sample Payload**: Form-data with a file field named `recipeFile`.
- **Response**:
  ```json
  {
    "title": "Spaghetti Carbonara",
    "ingredients": [
        "200g spaghetti",
        "A small bunch of fresh flat-leaf parsley"
    ],
    "instructions": "1. Cook the spaghetti in a large pot of boiling salted water until al dente...",
    "taste": "Rich and creamy",
    "reviews": 4.7,
    "cuisineType": "Italian",
    "preparationTime": 20,
    "_id": "6766d923da44467936e0362b",
    "__v": 0
  }
  ```

### Add Recipe from Image

- **Route**: `/recipeImage`
- **Method**: POST
- **Description**: Analyzes an uploaded image, extracts text related to a recipe, and adds the recipe to the database.
- **Sample Payload**: Form-data with a file field named `image`.
- **Response**:
  ```json
  {
    "title": "Spaghetti Carbonara",
    "ingredients": [
        "200g spaghetti",
        "A small bunch of fresh flat-leaf parsley"
    ],
    "instructions": "1. Cook the spaghetti in a large pot of boiling salted water until al dente...",
    "taste": "Rich and creamy",
    "reviews": 4.7,
    "cuisineType": "Italian",
    "preparationTime": 20,
    "_id": "6766d923da44467936e0362b",
    "__v": 0
  }
  ```

### Chatbot Interaction

- **Route**: `/chat`
- **Method**: POST
- **Description**: Interacts with a chatbot to suggest recipes based on a user's message, favourite recipes and available ingredients.
- **Sample Payload**:
  ```json
  {
    "message": "I want something sweet today"
  }
  ```
- **Sample Response**:
  ```json
  {
  "content": "How about trying a chocolate cake recipe?"
  }
  ```

## Usage Instructions

### Setup:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Run the server with `npm start`.

---

### Testing:

- Use tools like Postman to test API endpoints.
- For file uploads, ensure the request is sent as `multipart/form-data`.

---

### Error Responses:

- For invalid requests, the API will respond with appropriate error codes such as:
  - `400 Bad Request`
  - `404 Not Found`

---
