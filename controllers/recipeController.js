require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');

const homepage = async (req, res) => {
    try {
        const limitNumber = 4;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber + 1);
        const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber + 1);
        const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber + 1);
        const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber + 1);

        const food = { latest, thai, american, chinese };

        res.render('index', { title: 'Cooking Blog - Home', categories, food });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error in recipecontroller file" });
    }
}


const exploreCategories = async (req, res) => {
    try {
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories', { title: 'Cooking Blog - Categories', categories });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error in recipecontroller file" });
    }
}


const exploreCategoriesById = async (req, res) => {
    try {
        let categoryId = req.params.id;
        const limitNumber = 20;
        const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
        res.render('categories', { title: 'Cooking Blog - Categoreis', categoryById });
    } catch (error) {
        res.satus(500).send({ message: error.message || "Error Occured" });
    }
}




const exploreRecipe = async (req, res) => {
    try {
        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);
        res.render('recipe', { title: 'Cooking Blog - Recipe', recipe });
    } catch (error) {
        res.satus(500).send({ message: error.message || "Error Occured" });
    }
}

const searchRecipe = async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        let recipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });

        res.render('search', { title: 'Cooking Blog - Search', recipe });
    } catch (error) {
        res.satus(500).send({ message: error.message || "Error Occured" });
    }

}


const exploreLatest = async (req, res) => {
    try {
        const limitNumber = 20;
        const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
        res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', recipe });
    } catch (error) {
        res.satus(500).send({ message: error.message || "Error Occured" });
    }
}


const exploreRandom = async (req, res) => {
    try {
        let count = await Recipe.find().countDocuments();
        let random = Math.floor(Math.random() * count);
        let recipe = await Recipe.findOne().skip(random).exec();
        res.render('recipe', { title: 'Cooking Blog - Explore Latest', recipe });
    } catch (error) {
        res.satus(500).send({ message: error.message || "Error Occured" });
    }
}


const submitRecipe = async (req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj });
}


const submitRecipeOnPost = async (req, res) => {
    try {

        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if (!req.files || Object.keys(req.files).length === 0) {
            console.log('No Files where uploaded.');
        } else {

            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;

            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath, function (err) {
                if (err) return res.satus(500).send(err);
            })

        }

        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            ingredients: req.body.ingredients,
            category: req.body.category,
            image: newImageName
        });

        await newRecipe.save();

        req.flash('infoSubmit', 'Recipe has been submitted');
        res.redirect('/submit-recipe');
    } catch (error) {
        req.flash('infoSubmit', 'Recipe has been submitted');
        res.redirect('/submit-recipe');

    }
}



module.exports = {
    homepage,
    exploreCategories,
    exploreRecipe,
    exploreCategoriesById,
    searchRecipe,
    exploreLatest,
    exploreRandom,
    submitRecipe,
    submitRecipeOnPost
}