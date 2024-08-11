
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


// Attach the clear search function to the clear button
document.addEventListener('DOMContentLoaded', function() {
    const homeButton = document.getElementById('homeButton');
    if (homeButton) {
        homeButton.addEventListener('click', function(event) {
            event.preventDefault();
            clearSearch();
            window.location.href = '/index.html';
        });
    } else {
        console.debug('Home button does not exist in the DOM.');
    }
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


// generate a list of all hastags for simple search
function getSearchTags(recipeList) {
    let categorySet = new Set();
    let dietSet = new Set();

    recipeList.forEach(recipe => {
        // Accumulate unique category tags
        if (recipe.category) {
            recipe.category.split(' ').forEach(tag => {
                categorySet.add(tag.trim());
            });
        }

        // Accumulate unique diet tags
        if (recipe.diet) {
            recipe.diet.split(' ').forEach(tag => {
                dietSet.add(tag.trim());
            });
        }
    });

    // Convert sets to arrays and then to HTML string with tags
    let categoryTags = Array.from(categorySet).map(tag => 
        `<a href="#mealCardsSection" class="tag navbar-link-category" onclick="searchByTag('${encodeURIComponent(tag)}')">#${tag}</a>`
    ).join(' ');

    let dietTags = Array.from(dietSet).map(tag => 
        `<a href="#mealCardsSection" class="tag navbar-link-category" onclick="searchByTag('${encodeURIComponent(tag)}')">#${tag}</a>`
    ).join(' ');

    return categoryTags + ' ' + dietTags;
}



function displaySearchTags(tags) {
    NavBarCategory.innerHTML = tags;
}

// NEED TO UPDATE FOR RECIPE DIET
// adds itemList schema to the homepage
function addPageMetaData(data) {
    let metaData = "";
    metaData += `{
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": [`;

    // Iterate over the first 10 recipes in the data array
    for (let i = 0; i < Math.min(data.length, 10); i++) {
        const filename = data[i].id; // Assuming 'id' is the filename property
        if (i > 0) {
            metaData += ',';
        }
        metaData += `{
            "@type": "ListItem",
            "position": "${i + 1}", // Schema.org expects positions to start from 1
            "url": "https://cazzscookingcommunity.github.io/recipe.html?recipe=${filename}"
        }`;
    }
    metaData += `]}`;

    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.textContent = metaData;
    document.head.appendChild(script);
}





