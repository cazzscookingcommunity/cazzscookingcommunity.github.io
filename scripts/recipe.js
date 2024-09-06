
// after page loads update the favourites button
document.addEventListener('DOMContentLoaded', () => {
    let favouriteButton = document.getElementsByClassName('favourite')[0];
    let recipeId = favouriteButton.id;
    updateFavouriteButton(recipeId);
    checkRecipeFormat(recipeId);
    
    // Call the function to fetch diet and nutrition info
    fetchDietAndNutritionInfo();
});


function shareRecipe() {
    if (navigator.share) {    
        navigator.share({
            title: document.title,
            text: "Check out this recipe!",
            url: window.location.href
        }).then(() => {
            console.log("Thanks for sharing!");
        }).catch(err => {
            console.error("Error sharing:", err);
        });
    } else {
        alert("Web Share API not supported in this browser.");
    }
}

function printRecipe() {
    window.print();
}

function checkRecipeFormat(recipeId) {
    // intended to validate the format of the recipe.
}

function getIngredientsFromDOM() {
    // Select all <li> elements under the #ingredients section
    const ingredientsList = document.querySelectorAll('#ingredients ul li');

    // Map the NodeList to an array of ingredient strings
    const ingredients = Array.from(ingredientsList).map(li => li.textContent.trim());

    console.log(ingredients); // Check the extracted ingredients
    return ingredients;
}

function getServingsFromDOM() {
    const servingsElement = document.getElementById('servings');
    const servings = servingsElement ? parseInt(servingsElement.textContent, 10) : 1; // Default to 1 if not found
    return servings;
}

// get nutrition and diet info from edaman's nutrition api
function fetchDietAndNutritionInfo() {
    const title = document.title;
    const ingredients = getIngredientsFromDOM();
    const servings = getServingsFromDOM();
    const apiUrl = `https://api.edamam.com/api/nutrition-details?app_id=056daadb&app_key=b39f104d7fe033811500a3ce94c73a81`;

    console.debug(title, servings, ingredients);
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: title, ingr: ingredients, servings: servings }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('apiu response: ', data);
        displayDietAndNutritionInfo(data);
        displayHealthLabel(data, servings);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        document.getElementById('nutrition-error').style.display = 'block';
        document.getElementById('diet-info').style.display = 'none';
    });
}

function displayDietAndNutritionInfo(data) {
    document.getElementById('diet-nutrition-info').style.display = 'block';

    const cautions = data.cautions.join(', ') || 'None';
    const dietLabels = data.dietLabels.join(', ') || 'None';
    const healthLabels = data.healthLabels.join(', ') || 'None';

    document.getElementById('cautions').textContent = cautions;
    document.getElementById('diet-labels').textContent = dietLabels;
    document.getElementById('health-labels').textContent = healthLabels;
}
