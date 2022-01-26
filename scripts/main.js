var searchTree = {};
var recipeList = new DOMParser();
var $recipeList;
const path = "/recipes/";
const XMLrecipelist = "/xml/recipeList.xml";
window.scrollTo(0,$('#main').offset().top);



$(document).ready(function(){
    let recipelist = new DOMParser();
    fetch(XMLrecipelist)
    .then(res => res.text())
    .then(res => new DOMParser().parseFromString(res, "text/xml"))
    .then(res => {
        categorys = new Set();
        recipeList = res.querySelectorAll('recipe');
        $recipeList = $( recipeList );

        getCategorys($recipeList, "category, diet", categorys);

        //display categories for simple search
        let listCategory = [];
        categorys.forEach (function(value) {
            listCategory.push(`
            <li class="navbar-item">
            <a onclick="fetchCategoryMeal('${value}')"
            class="navbar-link-category" tabindex="0" href="#mealCardsSection">${value}</a>
            </li>`);
        })
        NavBarCategory.innerHTML = listCategory.join('');

        // create keyword to recipe map for category search & searchbar
        createSearchTree($recipeList);

        document.getElementById('searchRecipe').value='';

    });

    // Fetches random recipe
    $('.btnRandomRecipe').on('click', function(){
        fetchMeal($recipeList,'r');

        // Textual updates
        $('#dynamicTitle').text('The Random Recipe');
    });

    // Fetch searched recipe on click
    $('.btnSearchRecipe').on('click', function(){
        searchTerm = $.trim($('#searchRecipe').val());
        fetchCategoryMeal(searchTerm);
        // fetchMeal($recipeList, 'u');
    })

});

// Get recipe list based on search input using enter rather than click
$(document).keypress(function(e) {
    if( e.which == 13 && $.trim($('#searchRecipe').val()) !== '' ) {
        searchTerm = $.trim($('#searchRecipe').val());
        fetchCategoryMeal(searchTerm);
    }
});

// Show recipe of clicked meal
$(document).on('click','.mealCardRecipeBtn',function(){
    let meal = $(this).attr("data-meal"); // format = string
    meal = $.parseXML( meal ); // format = #document
    $meal = $( meal ); // format = jquery

    // fetchMeal($meal,'u');
    recipeFilename = $meal.find('filename').text()
    location.assign(`/recipe.html?recipe=${recipeFilename}`)

});


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

function addToTree(value, title) {
    if (!(value in searchTree)) {  // add new property
        searchTree[value] = [title];
    } else {                       // append recipe to existing property  
        searchTree[value].push(title);
    }
}

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

// Build search structure
function createSearchTree($recipeList) {
    for ( i = 0; i < $recipeList.length; i++ ) {
        getSearchValues($recipeList[i], "category, diet, title");
    }
}    

// Uses the fetch() to renadom recipe
function fetchMeal($meal, type){
    let url = '';
    if ( type == 'r' ) {
        randomNo = Math.floor(Math.random() * $meal.length );
        recipeFilename = $meal[randomNo].getElementsByTagName("filename")[0].innerHTML;
        url = (path + recipeFilename);
        location.assign(`/recipe.html?recipe=${recipeFilename}`)
    } else {
        console.error("invalid type requested");
    }
}
 

// Function to set the cookie
const setCookie = (key, value, exDays = 3) => {
    let date = new Date();
    date.setTime(date.getTime() + exDays*24*60*60*1000);
    document.cookie = key + "=" + value + "; expires=" + date.toUTCString() + ";path=/";
}

// Function to get cookie
const getCookie = (key) => {
    key = key + "=";
    var cookies = document.cookie.split(';');
    for(let i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      while (cookie.charAt(0) == ' ') cookie = cookie.substring(1);
      if (cookie.indexOf(key) == 0) { return cookie.substring(key.length, cookie.length) };
    }
    return null;
}

// Function to get cache data if it exists, otherwise, fetch from the API
// const getData = (types) => {
//     console.log("not yet implement");
    // types.forEach(type => {
    //     if( type === "u" ) {
    //         let mealData = JSON.parse(sessionStorage.getItem(type));
    //         if( mealData !== null ) {
    //             createMealCards(mealData);      
    //             window.scrollTo(0,$('#mealCardsSection').offset().top);
    //             $('#userInput').text(sessionStorage.getItem("search"));
    //         }
    //     }
    //     else {
    //         let mealData = null;
    //         try {
    //             mealData = JSON.parse(getCookie(type));
    //         } catch (error) { console.warn(error) };
    //         mealData !== null ? createMeal(mealData, type) : fetchMeal(type);
    //     }
    // })
// }


// search title, category, diet for a regex term
function searchRecipeList( searchTerm ) {
    var shortlist = []
    for ( i = 0; i < recipeList.length; i++ ) {
        $recipe = $( recipeList[i] );
        recipetitle = $recipe.find('title').text();
        title = $recipe.find('title').text().toLowerCase().indexOf(searchTerm.toLowerCase());
        category = $recipe.find('category').text().toLowerCase().indexOf(searchTerm.toLowerCase());
        diet = $recipe.find('diet').text().toLowerCase().indexOf(searchTerm.toLowerCase());
        
        if ( ( title > -1 ) || (category > -1) || (diet > -1) ) {
            shortlist.push(recipetitle)
        }
    }
    return(shortlist);
}

// fetch meals matching searchTerm
function fetchCategoryMeal(searchTerm){
    // let recipeNameShortList = searchTree[searchTerm.toUpperCase()];
    const recipeNameShortList = searchRecipeList(searchTerm);

    $("#errorMessageContainer").remove();
    $('#searchRecipe').val(searchTerm);
    $('#userInput').text(searchTerm);

    if ( ! ( recipeNameShortList == undefined ) ) {
        $('section#mealCardsSection').show();
        $('#mealCardsSection .container').show();
        window.scrollTo(0,$('#mealCardsSection').offset().top);
        createMealCards(recipeNameShortList);
        // setCache(res.meals, type);
    } else {
        $('section#mealCardsSection').show();
        $('section#random').hide();
        $('#mealCardsSection .container').hide();
        $("#mealCardsSection").prepend("<div id='errorMessageContainer' style='display:flex;'> <p id='errorMessageText'>No recipes match the search term '" + searchTerm + "'</p> <a id='errorMessageBtn' class='button' href='#landing' title='Search again' >Search again</a> </div>");
        window.scrollTo(0,$('#mealCardsSection').offset().top-100);
    }
}

// Create meal cards for shortlisted recipes
function createMealCards(shortlist) {
    let mealCards = '';

    for ( i = 0; i < recipeList.length; i++ ) {
        let title = recipeList[i].getElementsByTagName("title")[0].innerHTML;
        if ( shortlist.includes(title) ) {
            let serializer = new XMLSerializer();
            let mealData = serializer.serializeToString(recipeList[i]);
            console.debug(mealData);
            let img = recipeList[i].getElementsByTagName("thumbnail")[0].innerHTML;
            let file = recipeList[i].getElementsByTagName("filename")[0].innerHTML;

            mealCards += 
            `<div class="four columns">
                <div class="card">
                    <img src="${img}" alt="${title} thumbnail" data-meal='${mealData}' class="u-max-full-width mealCardRecipeBtn" />
                    <div class="card-body recipe-action" display="none">
                        <div class="cardTitle">${title}</div>
                        <button class="button mealCardRecipeBtn" data-meal='${mealData}'>Recipe</button>
                        <a href="mailto:?subject=https://cazzscookingcommunity.io/recipe.html?recipe=${file}">
                          <img class="cardAction" border="0" alt="email recipe" src="/components/icons8-mail-24.png">
                        </a>
                        <img class="cardAction" border="0" alt="edit recipe" onclick="window.open('${path}${file}')" src="/components/icons8-edit-24.png">
                    </div>
                </div>
            </div>`;
        }
    }
    $('section#random').hide();
    $('section#mealCardsSection').show();
    $('#mealCardsSection .container').show();
    $('.mealCards').html(mealCards);
}

// hamburger menu for mobile devices
// Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu bar icon
function mobileMenu() {
    var x = document.getElementById("navbar-list");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
} 

// hamburger menu for category list
function mobileCategoryMenu() {
    var x = document.getElementById("NavBarCategory");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
} 