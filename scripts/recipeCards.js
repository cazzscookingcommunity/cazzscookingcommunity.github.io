


//  create the mealCards for the searched recipes
function createMealCards(shortlist) {
    let mealCards = '';
    // Initialize tag variables
    let categoryTags = '';
    let dietTags = '';

    // Iterate over the shortlist directly
    shortlist.forEach(recipe => {
        let img = recipe.thumbnail || ""; // Assuming there's a `thumbnail` field
        let file = recipe.filename || ""; // Assuming there's a `filename` field
        let categoryTags = recipe.category
            ? recipe.category.split(' ').map(tag => `<a href="#" class="tag" onclick="searchByTag('${encodeURIComponent(tag.trim())}')">#${tag.trim()}</a>`).join(' ')
            : '';

        let dietTags = recipe.diet
            ? recipe.diet.split(' ').map(tag => `<a href="#" class="tag" onclick="searchByTag('${encodeURIComponent(tag)}')">#${tag}</a>`).join(' ')
            : '';

        // Split category into tags if not empty
        // if (recipe.category) {
        //     categoryTags = recipe.category.split(' ').map(tag => `#${tag}`).join(' ');
        // }

        // Split diet into tags if not empty
        // if (recipe.diet) {
        //     dietTags = recipe.diet.split(' ').map(tag => `#${tag}`).join(' ');
        // }

        mealCards += 
        `<div class="cards four columns">
            <div class="card">
                <a href="/recipe.html?recipe=${file}">
                    <img src="${imgpath}${img}" alt="${recipe.title} thumbnail" class="u-max-full-width mealCardRecipeBtn" />
                </a>
                <div class="card-body recipe-action" display="none">
                    <div class="cardTitle">${recipe.title}</div>
                    <div class="cardTags">${categoryTags} ${dietTags}</div>
                </div>
            </div>
        </div>`;
    });

//     <div class="cardActions">
//     <a href="/recipe.html?recipe=${file}">
//         <button class="button mealCardRecipeBtn">Recipe</button>
//     </a>
// </div>

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