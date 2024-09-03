document.addEventListener('DOMContentLoaded', () => {
    // Retrieve favorite recipes from local storage
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    console.debug("favourites: ", favourites);
   
    // Iterate over each recipe card
    document.querySelectorAll('.card').forEach(card => {
        const recipeId = card.querySelector('.favourite').id;

        // Update the favourite icon if the recipe is in the list of favorites
        if (favourites.includes(recipeId)) {
            card.querySelector('.favourite').innerText = '❤️';
        }  
    });
  });
