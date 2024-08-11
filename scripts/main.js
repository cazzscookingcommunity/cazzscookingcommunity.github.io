// var searchTree = {};
// var recipeList = new DOMParser();
// var $recipeList;
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

// this is part of preserving search state for the back function
function updateHistoryState(searchTerm, results) {
    window.history.pushState({ searchTerm, searchResults: results }, '', `?search=${encodeURIComponent(searchTerm)}`);
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



function saveSearchState(searchTerm, results) {
    sessionStorage.setItem('searchTerm', searchTerm);
    sessionStorage.setItem('searchResults', JSON.stringify(results));
}

function restoreSearchState() {
    const savedSearchTerm = sessionStorage.getItem('searchTerm');
    const savedResults = sessionStorage.getItem('searchResults');

    if (savedSearchTerm && savedResults) {
        const results = JSON.parse(savedResults);
        const recipeNameShortList = results.map(result => {
            return recipeList.find(doc => doc.id === result.ref);
        });

        $('#searchRecipe').val(savedSearchTerm);
        createMealCards(recipeNameShortList);
        $('section#mealCardsSection').show();
        $('#mealCardsSection .container').show();
    }
}


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



function searchRecipes(searchTerm) {
    const results = idx.search(searchTerm);
    saveSearchState(searchTerm, results); 
    
    // Fetch the results from the index
    const searchResult = results.map(result => {
        return recipeList.find(doc => doc.id === result.ref);
    });
  
    displaySearchResults(searchResult, searchTerm);
}





//  create the mealCards for the searched recipes
function createMealCards(shortlist) {
    let mealCards = '';

    // Iterate over the shortlist directly
    shortlist.forEach(recipe => {
        let img = recipe.thumbnail || ""; // Assuming there's a `thumbnail` field
        let file = recipe.filename || ""; // Assuming there's a `filename` field


        mealCards += 
        `<div class="cards four columns">
            <div class="card">
                <a href="/recipe.html?recipe=${file}">
                    <img src="${imgpath}${img}" alt="${recipe.title} thumbnail" class="u-max-full-width mealCardRecipeBtn" />
                </a>
                <div class="card-body recipe-action" display="none">
                    <div class="cardTitle">${recipe.title}</div>
                    <div class="cardActions">
                        <a href="/recipe.html?recipe=${file}">
                            <button class="button mealCardRecipeBtn">Recipe</button>
                        </a>
                    </div>
                </div>
            </div>
        </div>`;
    });

    $('section#random').hide();
    $('section#mealCardsSection').show();
    $('#mealCardsSection .container').show();
    $('.mealCards').html(mealCards);
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

// search tips popup
document.querySelectorAll('.info-container').forEach(function(container) {
    let pressTimer;

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        // Desktop: Hover logic
        container.addEventListener('mouseover', function() {
            const popup = container.querySelector('.info-popup');
            popup.style.display = 'block';
            const rect = container.getBoundingClientRect();
            popup.style.left = `${rect.left + (rect.width / 2) - (popup.offsetWidth / 2)}px`;
            popup.style.top = `${rect.top - popup.offsetHeight - 10}px`; // Position above the icon
        });

        container.addEventListener('mouseout', function() {
            container.querySelector('.info-popup').style.display = 'none';
        });
    } else {
        // Mobile: Touch logic
        container.addEventListener('touchstart', function(e) {
            clearTimeout(pressTimer); // Clear any existing timer
            pressTimer = setTimeout(function() {
                container.classList.add('active');
                const touch = e.touches[0];
                const popup = container.querySelector('.info-popup');

                popup.style.display = 'block';
                popup.style.position = 'fixed'; // Use fixed positioning for mobile
                popup.style.left = '50%'; // Center horizontally
                popup.style.top = `${Math.max(touch.clientY - popup.offsetHeight - 20, 0)}px`; // Ensure it stays within the viewport
                popup.style.transform = 'translate(-50%, 0)'; // Center horizontally
                popup.style.zIndex = '1000'; // Ensure it's above other elements
            }, 500);
            e.preventDefault();
        });

        container.addEventListener('touchend', function() {
            clearTimeout(pressTimer);
            container.classList.remove('active');
            const popup = container.querySelector('.info-popup');
            popup.style.display = 'none'; // Hide the popup when touch ends
            popup.style.left = ''; // Reset position
            popup.style.top = ''; // Reset position
        });

        container.addEventListener('touchcancel', function() {
            clearTimeout(pressTimer);
            container.classList.remove('active');
            const popup = container.querySelector('.info-popup');
            popup.style.display = 'none'; // Hide the popup if touch is canceled
            popup.style.left = ''; // Reset position
            popup.style.top = ''; // Reset position
        });
    }
});




