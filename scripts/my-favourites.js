

function toggleFavourite(recipeId) {
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    if (favourites.includes(recipeId)) {
        favourites = favourites.filter(id => id !== recipeId);
        console.debug("remove from favourites");
    } else {
        favourites.push(recipeId);
        console.debug("add to favourites");
    }
    localStorage.setItem('favourites', JSON.stringify(favourites));
    if (favourites.length > 0) {
        updateFavouriteButton(recipeId);
    }
    else {
        location.reload();
    }
}

function getFavouriteState(recipeId) {
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    if (favourites.includes(recipeId)) {
        textContent = '❤️ Remove from Favourites';
    } else {
        textContent = '❤️ Add to Favourites';
    }
    return textContent
}

function updateFavouriteButton(recipeId) {
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    // const button = document.querySelector(`button[onclick="toggleFavourite('${recipeId}')"]`);
    const button = document.getElementById(`${recipeId}`);
    if (favourites.includes(recipeId)) {
        button.textContent = '❤️ Remove from Favourites';
    } else {
        button.textContent = '❤️ Add to Favourites';
    }
}

function clearFavourites() {
    favourites = [];
    localStorage.setItem('favourites', JSON.stringify(favourites));
    location.reload();
}

// displays the search results
function displayFavourites(favourites) {
    $("#errorMessageContainer").remove();
    $('#userInput').text("My Favourites");
    $('section#mealCardsSection').show();
    $('#mealCardsSection .container').show();
    window.scrollTo(0,$('#main').offset().top);
    createMealCards(favourites);
}

function loadFavourites() {
    // only display favourites if no search
    const savedSearchTerm = sessionStorage.getItem('searchTerm');
    const savedResults = sessionStorage.getItem('searchResults');
    if ( ! (savedSearchTerm && savedResults) ) {
        let favourites = JSON.parse(localStorage.getItem('favourites')) || [];

        if (favourites.length > 0) {
            const favouriteRecipes = recipeList.filter(recipe => favourites.includes(recipe.id));
            displayFavourites(favouriteRecipes);
        }

    }
}
    

