
var recipeList=[];
const SearchIndexFile = "/search_index.json";
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
                this.field('htmlFilename');
                this.field('category');
                this.field('diet');
                this.field('ingredients');

                // Add documents to the index
                data.forEach(recipe => {
                    // add lowercase recipes to index
                    this.add({
                        id: recipe.id,
                        title: recipe.title,
                        htmlFilename: recipe.htmlFilename.toLowerCase(),
                        thumbnail: recipe.thumbnail.toLowerCase(),
                        category: recipe.category.toLowerCase(),
                        diet: recipe.diet.toLowerCase(),
                        ingredients: recipe.ingredients.toLowerCase(),
                    });
                    // create in-memory list of recipe key elements for meal cards 
                    recipeList.push(recipe);
                });
            });

            console.debug("recipeList: ", recipeList);
            let searchTags = getSearchTags(recipeList); 
            displaySearchTags(searchTags);

            document.getElementById('searchRecipe').value='';
            document.getElementById('userInput').text='';

            // addPageMetaData(recipeList);
            restoreSearchState();
            loadFavourites();
    
        })
        .catch(error => console.error('Error fetching JSON index:', error));


    // Fetch a random recipe
    // $('.btnRandomRecipe').on('click', function(){
    //     fetchMeal(recipeList,'r');
    //     $('#dynamicTitle').text('The Random Recipe');
    // });

    // Get the searched recipes on click
    $('.btnSearchRecipe').on('click', function(){
        searchTerm = $.trim($('#searchRecipe').val());
        searchRecipes(searchTerm);
    })

    // Get the searched recipes on Enter
    $('#searchRecipe').keypress(function(e) {
        if( e.which == 13 && $.trim($(this).val()) !== '' ) {
            searchTerm = $.trim($(this).val());
            searchRecipes(searchTerm);
        }
    });
});

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

    // Convert sets to arrays, sort them, and then create HTML strings with tags
    let categoryTags = Array.from(categorySet)
        .sort() // Sort alphabetically
        .map(tag => 
            `<a href="#mealCardsSection" class="recipe-tag" onclick="searchByTag('${encodeURIComponent(tag)}')">#${tag}</a>`
        )
        .join(' ');

    let dietTags = Array.from(dietSet)
        .sort() // Sort alphabetically
        .map(tag => 
            `<a href="#mealCardsSection" class="recipe-tag" onclick="searchByTag('${encodeURIComponent(tag)}')">#${tag}</a>`
        )
        .join(' ');

    return 'DIET: ' + dietTags + '<br/>MEAL: ' + categoryTags;
}



function displaySearchTags(tags) {
    const recipeTags = document.getElementById("recipe-tags");
    if (recipeTags) {
        recipeTags.innerHTML = tags;
    }
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
            "url": "https://cazzscookingcommunity.github.io/recipes/html/${filename}"
        }`;
    }
    metaData += `]}`;

    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.textContent = metaData;
    document.head.appendChild(script);
}





