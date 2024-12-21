const { OpenAI } = require('openai');
const Ingredient = require('../models/Ingredient');
const Recipe = require('../models/Recipe');
const fs = require('fs');
const FormData = require('form-data');

// Initialize OpenAI API with the API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your environment variables
  });
  
exports.chatbotInteraction = async (req, res) => {
  const userMessage = req.body.message;
  // Fetch available ingredients
  const availableIngredients = await Ingredient.find();
  const ingredientList = availableIngredients.map(i => i.name).join(', ');

  // Fetch available recipes
  const availableRecipes = await Recipe.find();
  const recipeList = availableRecipes.map(r => r.title).join(', ');

  // Construct the prompt
  const prompt = `
  You are a helpful kitchen assistant. Based on the available ingredients: ${ingredientList},
  and the following available recipes: ${recipeList},
  suggest a recipe for: ${userMessage}
  `;
  try {
    // Create a chat completion request to OpenAI API for generating JSON
    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150, // Limit the token usage for the response
    });
    
    //console.log(response.choices[0].message.content)
    res.json({ content: response.choices[0].message.content.trim()});
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.addRecipeFromFile = async (req, res) => {
    try {
      // Assuming the file is uploaded as 'recipeFile'
      const file = req.files.recipeFile;
      const textContent = file.data.toString('utf8');
  
      // Define the JSON format template
      const jsonTemplate = `
      {
        "title": "Example Title",
        "ingredients": ["Example Ingredient"],
        "instructions": "Example instructions.",
        "taste": "Example taste",
        "reviews": 0,
        "cuisineType": "Example cuisine",
        "preparationTime": 0
      }
      `;
  
      // Generate JSON from text using AI
      const prompt = `
      Extract the recipe details from the following text and format it as JSON. If the text doesn't contain enough data, fill in the missing parts based on common knowledge:
      ${textContent}
  
      Use this JSON format completely. Considered the type given in the format specially:
      ${jsonTemplate}

      Complete in max 150 tokens shortly.
      `;
  
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500, // Limit the token usage for the response
      });
    
    
  
      // Extract the content of the response
      const fullContent = response.choices[0].message.content;
      const jsonResponse = fullContent
      console.log(jsonResponse)
  
      // Parse the JSON response
      let recipeData;
      try {
        recipeData = JSON.parse(jsonResponse);
      } catch (error) {
        return res.status(400).send('Failed to parse JSON from AI response');
      }
  
      // Add recipe to the database
      const recipe = new Recipe(recipeData);
      await recipe.save();
  
      // Append recipe to the text file
      const formattedRecipe = `
      Title: ${recipeData.title}
      Ingredients: ${recipeData.ingredients.join(', ')}
      Instructions: ${recipeData.instructions}
      Taste: ${recipeData.taste}
      Reviews: ${recipeData.reviews}
      Cuisine Type: ${recipeData.cuisineType}
      Preparation Time: ${recipeData.preparationTime} minutes
      `;
  
      fs.appendFileSync('my_fav_recipes.txt', formattedRecipe);
  
      res.status(201).json(recipe);
    } catch (error) {
      res.status(500).json(error.message);
    }
  };

exports.addRecipeFromImage = async(req, res) => {
    try {
        // Validate if file is included in the request
        if (!req.files || !req.files.image) {
          return res.status(400).send('No image file was uploaded.');
        }

        const formData = new FormData();
  
      // Get the path of the uploaded file
        const filePath = path.join(__dirname,"..", req.file.path);
        //console.log(filePath)
        // Append the file to FormData using a readable stream
        formData.append('image', fs.createReadStream(filePath), req.file.originalname);
        // Send the form data to ImgBB
        const responseImage = await axios.post(
            'https://api.imgbb.com/1/upload',
            formData,
            {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            },
            params: {
                key: IMGBB_API_KEY,
            },
            }
        );
    
      // Extract the image URL from ImgBB response
        const imageUrl = responseImage.data.data.url;
    
        //const imageFile = req.files.image;
        const imageDataUri = imageUrl
    
        // Set the prompt for image analysis
        const prompt = `
      Extract the recipe details from the image and format it as JSON. If the image doesn't contain enough data, fill in the missing parts based on common knowledge.
      Use this JSON format completely. Considered the type given in the format specially:
      ${jsonTemplate}

      Complete in max 150 tokens shortly.
      `;
    
        // Send the image data to the OpenAI API for analysis
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini", // Please ensure this is a valid model for your use case
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { "url": imageDataUri } }
              ],
            }
          ],
          max_tokens: 300
        });
    
        // Extract the description from the response
        const description = response.data.choices[0].text.trim();
    
        // Convert the description into a JSON format
        const jsonTemplate = `
        {
          "title": "Generated Recipe",
          "ingredients": ["Example Ingredient"],
          "instructions": "${description}",
          "taste": "Unknown",
          "reviews": 0,
          "cuisineType": "Unknown",
          "preparationTime": 0
        }
        `;
        
        // Optionally parse the JSON
        let recipeData;
        try {
          recipeData = JSON.parse(jsonTemplate);
        } catch (error) {
          return res.status(400).send('Failed to generate valid JSON from the response');
        }
    
        // Send the generated JSON back to the client
        res.status(201).json(recipeData);
      } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
      }
}