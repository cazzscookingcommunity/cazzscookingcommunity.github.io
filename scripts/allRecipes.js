var recipeList=[];
const path = "/recipes/";
const imgpath = "/images/"
const SearchIndexFile = "/components/search_index.json";
let idx;

// fetch('/components/search_index.json')
//   .then(response => response.json())
//   .then(data => {
//     const recipeContainer = document.getElementById('mealCardsSection');
//     data.forEach(recipe => {
//       const recipeCard = document.createElement('div');
//       recipeCard.innerHTML = `
//         <a href="/recipe.html?recipe=${recipe.filename}">
//           ${recipe.title}
//         </a>
//       `;
//       recipeContainer.appendChild(recipeCard);
//     });
//     recipeContainer.style.display = 'block';
//   });


$(document).ready(function(){
    // Load the search index from the JSON file
    fetch(SearchIndexFile)
        .then(response => response.json())
        .then(data => {
            // Initialize the Lunr.js index
            idx = lunr(function () {
                this.ref('id');
                this.field('title');
                this.field('category');
                this.field('diet');
                this.field('ingredients');

                // Add documents to the index
                data.forEach(recipe => {
                    // add lowercase recipes to index
                    this.add({
                        id: recipe.id,
                        title: recipe.title.toLowerCase(),
                        category: recipe.category.toLowerCase(),
                        diet: recipe.diet.toLowerCase(),
                        ingredients: recipe.ingredients.toLowerCase(),
                    });
                    // create in-memory list of recipe key elements for meal cards 
                    recipeList.push(recipe);
                });
            });

        sessionStorage.removeItem('searchTerm'); // Clear search term
        sessionStorage.removeItem('searchResults'); // Clear search results
        searchRecipes(''); // Call searchRecipes when the page loads

        // document.getElementById('searchRecipe').value='';

        })
        .catch(error => console.error('Error fetching JSON index:', error));
});


// Ensure the DOM is fully loaded before adding event listeners
// document.addEventListener('DOMContentLoaded', (event) => {
//     // Check if the current page is allRecipes.html
//     if (window.location.pathname === '/allRecipes.html') {
//         sessionStorage.removeItem('searchTerm'); // Clear search term
//         sessionStorage.removeItem('searchResults'); // Clear search results
//         searchRecipes(); // Call searchRecipes when the page loads
//     }
// });


// Search
function searchRecipes(searchTerm) {
    const results = idx.search(searchTerm);

    // Fetch the results from the index
    const searchResult = results.map(result => {
        return recipeList.find(doc => doc.id === result.ref);
    });
  
    displaySearchResults(searchResult, searchTerm);
}


// displays the search results
function displaySearchResults(searchResult, searchTerm) {
    $("#errorMessageContainer").remove();
    $('#searchRecipe').val(searchTerm);
    $('#userInput').text(searchTerm);

    if ( ! ( searchResult == undefined ) ) {
        $('section#mealCardsSection').show();
        $('#mealCardsSection .container').show();
        window.scrollTo(0,$('#mealCardsSection').offset().top);
        createMealCards(searchResult);
    } else {
        $('section#mealCardsSection').show();
        $('section#random').hide();
        $('#mealCardsSection .container').hide();
        $("#mealCardsSection").prepend("<div id='errorMessageContainer' style='display:flex;'> <p id='errorMessageText'>No recipes match the search term '" + searchTerm + "'</p> <a id='errorMessageBtn' class='button' href='#landing' title='Search again' >Search again</a> </div>");
        window.scrollTo(0,$('#mealCardsSection').offset().top-100);
    }
}

