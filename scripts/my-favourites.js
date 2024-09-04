

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
    updateFavouriteButton(recipeId);

    if (favourites.length == 0) {
         clearFavourites();
    }
}

function getFavouriteState(recipeId) {
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    textContent = favourites.includes(recipeId) ? '❤️' : '🤍';
    // let favouriteIcon = isFavourite ? '✖️⭐' : '⭐';

    return textContent
}

function updateFavouriteButton(recipeId) {
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    const button = document.getElementById(`${recipeId}`);
    if (favourites.includes(recipeId)) {
        button.textContent = '❤️';
    } else {
        button.textContent = '🤍';
    }
}

function clearFavourites() {
    favourites = [];
    localStorage.setItem('favourites', JSON.stringify(favourites));
    
    // if no search (i.e. displaying My Favourites) then reload
    const savedSearchTerm = sessionStorage.getItem('searchTerm');
    const savedResults = sessionStorage.getItem('searchResults');
    if ( ! (savedSearchTerm && savedResults) ) {
        location.reload();
    }
}

function loadFavourites() {
    // only display favourites if no search
    const savedSearchTerm = sessionStorage.getItem('searchTerm');
    const savedResults = sessionStorage.getItem('searchResults');
    if ( ! (savedSearchTerm && savedResults) ) {
        let favourites = JSON.parse(localStorage.getItem('favourites')) || [];

        if (favourites.length > 0) {
            const favouriteRecipes = recipeList.filter(recipe => favourites.includes(recipe.id));
            displaySearchResults(favouriteRecipes, "My Favourites");
        }
    }
}
    

