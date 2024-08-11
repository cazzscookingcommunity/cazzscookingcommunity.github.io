





//  create the mealCards for the searched recipes
function createMealCards(shortlist) {
    let mealCards = '';

    // Iterate over the shortlist directly
    shortlist.forEach(recipe => {
        let img = recipe.thumbnail || ""; // Assuming there's a `thumbnail` field
        let file = recipe.filename || ""; // Assuming there's a `filename` field


        mealCards += 
        `<div class="cards four columns">
            <div class="card">
                <a href="/recipe.html?recipe=${file}">
                    <img src="${imgpath}${img}" alt="${recipe.title} thumbnail" class="u-max-full-width mealCardRecipeBtn" />
                </a>
                <div class="card-body recipe-action" display="none">
                    <div class="cardTitle">${recipe.title}</div>
                    <div class="cardActions">
                        <a href="/recipe.html?recipe=${file}">
                            <button class="button mealCardRecipeBtn">Recipe</button>
                        </a>
                    </div>
                </div>
            </div>
        </div>`;
    });

    $('section#random').hide();
    $('section#mealCardsSection').show();
    $('#mealCardsSection .container').show();
    $('.mealCards').html(mealCards);
}


// get a random recipe
function fetchMeal(allRecipes, type) {
    if (type === 'r') {
        const randomNo = Math.floor(Math.random() * allRecipes.length);
        const recipeFilename = allRecipes[randomNo].id;
        const url = path + recipeFilename;
        // Redirect to the recipe page
        location.assign(`/recipe.html?recipe=${recipeFilename}`);
    } else {
        console.error("Invalid type requested");
    }
}