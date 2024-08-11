
var recipeList=[];
const path = "/recipes/";
const imgpath = "/images/"
const SearchIndexFile = "/components/search_index.json";
let idx;
window.scrollTo(0,$('#main').offset().top);



$(document).ready(function(){
    const searchTags = new Set();

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

        let searchTags = getSearchTags(recipeList); 
        displaySearchTags(searchTags);

        document.getElementById('searchRecipe').value='';

        // addPageMetaData(recipeList);
        restoreSearchState();
    
        })
        .catch(error => console.error('Error fetching JSON index:', error));


    // Fetches random recipe
    $('.btnRandomRecipe').on('click', function(){
        fetchMeal(recipeList,'r');

        // Textual updates
        $('#dynamicTitle').text('The Random Recipe');
    });

    // Fetch searched recipe on click
    $('.btnSearchRecipe').on('click', function(){
        searchTerm = $.trim($('#searchRecipe').val());
        searchRecipes(searchTerm);
    })

});

// this is part of preserving search state for the back function
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.searchTerm && event.state.searchResults) {
        const recipeNameShortList = event.state.searchResults.map(result => {
            return data.find(doc => doc.id === result.ref);
        });

        $('#searchRecipe').val(event.state.searchTerm);
        createMealCards(recipeNameShortList);
    }
});

// JavaScript to clear session storage on clear button click
document.getElementById('clearButton').addEventListener('click', function() {
    sessionStorage.removeItem('searchTerm'); // Clear search term
    sessionStorage.removeItem('searchResults'); // Clear search results
    document.getElementById('searchRecipe').value='';
    $('section#mealCardsSection').show();
    $('section#random').hide();
    $('#mealCardsSection .container').hide();
});

// Get recipe list based on search input using enter rather than click
$(document).keypress(function(e) {
    if( e.which == 13 && $.trim($('#searchRecipe').val()) !== '' ) {
        searchTerm = $.trim($('#searchRecipe').val());
        searchRecipes(searchTerm);
    }
});


// hamburger menu for category list
function mobileCategoryMenu() {
    var x = document.getElementById("NavBarCategory");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
} 






