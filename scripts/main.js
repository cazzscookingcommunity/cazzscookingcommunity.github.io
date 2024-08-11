
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

                    // used for predefined searches
                    if (recipe.category) {
                        searchTags.add(recipe.category);
                    }
                    if (recipe.diet) {
                        searchTags.add(recipe.diet);
                    }
                });

                
            });

        console.debug("search tags:", searchTags);
        console.debug("index: ", idx);
        console.debug("recipeList: ");
        console.log(JSON.stringify(recipeList, null, 4));

        // Display predefined searchTags for simple search
        let simpleSearchTerms = [];
        searchTags.forEach(value => {
            simpleSearchTerms.push(`
            <li class="navbar-item">
            <a onclick="searchRecipes('${value}')"
            class="navbar-link-category" tabindex="0" href="#mealCardsSection">${value}</a>
            </li>`);
        });

        // Insert the category list into the HTML
        // document.getElementById('categoryList').innerHTML = simpleSearchTerms.join('');
        // NavBarCategory.innerHTML = simpleSearchTerms.join('');

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


// NOT REQUIRED ONCE SEARCH BOXES ADDED
// get recipe Categories for pre-defined search filters 
function getCategorys($recipe, cssSelector, newlist) {
    x = $recipe.find(cssSelector);
    for ( let i = 0; i < x.length; i++ ) {
        y = x[i].innerHTML.split(" ");  // handle space separated elements like <title>
        for ( let j = 0; j < y.length; j++ ) {
            cat = y[j];
            // cat = y[j].replace(",", "");
            // cat = cat.replace("(", "");
            // cat = cat.replace(")", "");
            // cat = cat.replace("*", "");
            // cat = cat.replace("!", "");
            // cat = cat.replace("-", "");
            if ( ! ( cat == "" ) ) {
                newlist.add(cat);
            }
        }
    }
}


// NOT REQUIRED ONCE SEARCH BOXES ADDED
function addToTree(value, title) {
    if (!(value in searchTree)) {  // add new property
        searchTree[value] = [title];
    } else {                       // append recipe to existing property  
        searchTree[value].push(title);
    }
}

// NOT REQUIRED ONCE SEARCH BOXES ADDED
// get lables for search tree 
function getSearchValues($recipe, cssSelector) {
    keywords = $recipe.querySelectorAll(cssSelector);
    title = $recipe.getElementsByTagName('title')[0].innerHTML;
    for ( let i = 0; i < keywords.length; i++ ) {
        x = keywords[i].innerHTML.split(" ");  // handle space separated elements like <title>
        for ( let j = 0; j < x.length; j++ ) { 
            addToTree(x[j].toUpperCase(), title);
        }
    }
}





// hamburger menu for mobile devices
// Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu bar icon
// function mobileMenu() {
//     var x = document.getElementById("navbar-list");
//     if (x.style.display === "block") {
//       x.style.display = "none";
//     } else {
//       x.style.display = "block";
//     }
// } 

// hamburger menu for category list
function mobileCategoryMenu() {
    var x = document.getElementById("NavBarCategory");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
} 






