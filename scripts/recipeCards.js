imgpath = '/recipes/images/'


//  create the mealCards for the searched recipes
function createMealCards(shortlist) {
    let mealCards = '';
    // Initialize tag variables
    let categoryTags = '';
    let dietTags = '';
    

    // Iterate over the shortlist directly
    shortlist.forEach(recipe => {
        let recipeId = recipe.id;
        let favouriteState = getFavouriteState(recipeId);
        let img = recipe.thumbnail || ""; // Assuming there's a `thumbnail` field
        let file = recipe.htmlFilename || ""; // Assuming there's a `htmlFilename` field
        let categoryTags = recipe.category
            ? recipe.category.split(' ').map(tag => `<a href="#mealCardsSection" class="tag" onclick="searchByTag('${encodeURIComponent(tag.trim())}')">#${tag.trim()}</a>`).join(' ')
            : '';

        let dietTags = recipe.diet
            ? recipe.diet.split(' ').map(tag => `<a href="#mealCardsSection" class="tag" onclick="searchByTag('${encodeURIComponent(tag)}')">#${tag}</a>`).join(' ')
            : '';

        mealCards += 
        `<div class="cards four columns">
            <div class="card">
                <a href="/recipes/html/${file}">
                    <img src="${imgpath}${img}" alt="${recipe.title} thumbnail" class="u-max-full-width mealCardRecipeBtn" />
                </a>
                <button class="favourite" id="${recipeId}" onclick="toggleFavourite('${recipeId}')">${favouriteState}</button>

                <div class="card-body recipe-action" display="none">
                    <div id="cardTitle">${recipe.title}</div>
                    <div id="cardTags">${categoryTags} ${dietTags}</div>
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
// function fetchMeal(allRecipes, type) {
//     if (type === 'r') {
//         const randomNo = Math.floor(Math.random() * allRecipes.length);
//         const recipeFilename = allRecipes[randomNo].htmlFilename;
//         // const url = path + recipeFilename;
//         // Redirect to the recipe page
//         location.assign(`/recipes/html/${recipeFilename}`);
//     } else {
//         console.error("Invalid type requested");
//     }
// }