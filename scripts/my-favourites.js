// Call this function when the page loads to update the button state
// document.addEventListener('DOMContentLoaded', () => {
//     const recipeId = 'recipeId'; // Replace with the actual recipe ID
//     updateFavouriteButton(recipeId);
// });

// document.addEventListener('DOMContentLoaded', loadFavourites);



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
    // location.reload();
    updateFavouriteButton(recipeId);
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






// function removeFavourite(recipeId) {
//     let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
//     favourites = favourites.filter(id => id !== recipeId);
//     localStorage.setItem('favourites', JSON.stringify(favourites));
//     // loadFavourites(); // Refresh the list
//     console.debug("location.reload");
//     location.reload();
// }

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
        console.debug("favouties: ", favourites);
        console.debug("recipeList: ", recipeList);

        if (favourites.length > 0) {
            console.log("true");
            console.debug("favourites: ", favourites);
            console.debug("recipeList: ", recipeList);
            const favouriteRecipes = recipeList.filter(recipe => favourites.includes(recipe.id));
            console.debug("favouriteRecipes: ", favouriteRecipes);
        
            displayFavourites(favouriteRecipes);
        }
        else {
            console.log ("false")
        }

    }
}
    

    // Filter recipes to get only the favourites



    // favourites.forEach(recipeId => {
    //     // Assuming you have a function to get recipe details by ID
    //     const recipe = getRecipeById(recipeId); 
    //     let listItem = document.createElement('li');
    //     listItem.textContent = recipe.name; // Replace with recipe name or details
    //     favouritesList.appendChild(listItem);
    // });



