const express = require('express');
const router = express.Router();
const { homepage, exploreCategories, exploreRecipe, exploreCategoriesById, searchRecipe, exploreLatest, exploreRandom, submitRecipe, submitRecipeOnPost } = require('../controllers/recipeController');


router.get('/', homepage);
router.get('/recipe/:id', exploreRecipe);
router.get('/categories', exploreCategories);
router.get('/categories/:id', exploreCategoriesById);
router.post('/search', searchRecipe);
router.get('/explore-latest', exploreLatest);
router.get('/explore-random', exploreRandom);
router.get('/submit-recipe', submitRecipe);
router.post('/submit-recipe', submitRecipeOnPost);


module.exports = router;