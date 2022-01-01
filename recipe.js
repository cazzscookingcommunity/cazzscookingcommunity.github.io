var searchTree = {};
var recipeList = new DOMParser();
var $recipeList;
// var result = new DOMParser();
var path = "../recipes/";
var XMLrecipelist = path + "recipeList.xml";
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
        getSearchValues(res, "recipeCategory, diet, meal", categorys);

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
        createSearchTree(recipeList);

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

    // Fetch content after 3s
    // setTimeout(getData(['u', 'r']), 1000);

});

// Get recipe list based on search input using enter rather than click
$(document).keypress(function(e) {
    if( e.which == 13 && $.trim($('#searchRecipe').val()) !== '' ) {
        console.debug("register enter");
        searchTerm = $.trim($('#searchRecipe').val());
        fetchCategoryMeal(searchTerm);
    }
});

// Show recipe of clicked meal
$(document).on('click','.mealCardRecipeBtn',function(){
    let meal = $(this).attr("data-meal"); // format = string
    meal = $.parseXML( meal ); // format = #document
    $meal = $( meal ); // format = jquery
    console.debug($meal);

    fetchMeal($meal,'u');
    window.scrollTo(0,$('#random').offset().top);
    $('#dynamicTitle').text($meal.find('title').text());
});


// add recipe categorys to search tree
function getSearchValues(recipe, cssSelector, newlist) {
    x = recipe.querySelectorAll(cssSelector);
    for ( let i = 0; i < x.length; i++ ) {
        y = x[i].innerHTML.split(" ");  // handle space separated elements like <title>
        for ( let a = 0; a < y.length; a++ ) { 
            newlist.add(y[a]);
        }
    }
}

function addToTree(recipe) {
    let category = new Set();
    title = recipe.querySelector("title").innerHTML;
    getSearchValues(recipe, "recipeCategory, diet, meal, title", category);
    category.forEach (function(value) {
        if (!(value in searchTree)) {  // add new property
            searchTree[value.toUpperCase()] = [title];
        } else {                       // append recipe to existing property  
            searchTree[value].push(title);
        }
    });
}

// Build search structure
function createSearchTree(recipeList) {
    for ( let i = 0; i < recipeList.length; i++ ) {
        addToTree(recipeList[i]);
    }
}    

// Uses the fetch() API to request random meal recipe
function fetchMeal($meal, type){
    let url = '';
    if ( type == 'r' ) {
        randomNo = Math.floor(Math.random() * $meal.length );
        recipeFilename = $meal[randomNo].getElementsByTagName("filename")[0].innerHTML;
        // recipeFilename = $meal[randomNo].find("filename").text();
        url = (path + recipeFilename);
    } else {
        url = (path + $meal.find('filename').text());
    }

    console.debug(url);
    fetch(url)
    .then(res => res.text())
    .then(res => new DOMParser().parseFromString(res, "text/xml"))
    .then(res => {
        console.debug(res);
        recipe = res.querySelectorAll('recipe');
        $recipe = $( recipe );
        console.debug($recipe);
        createMeal($recipe, 'r');
        // setCache(res, type);
    })
    .catch( e => console.warn(e) );

    $('section#random').show();
    window.scrollTo(0,$('#random').offset().top)
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
const getData = (types) => {
    console.log("not yet implement");
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
}

function fetchCategoryMeal(searchTerm){
    console.debug(searchTerm);
    let recipeNameShortList = searchTree[searchTerm.toUpperCase()];
    if ( ! ( recipeNameShortList == undefined ) ) {
        createMealCards(recipeNameShortList);
        window.scrollTo(0,$('#mealCardsSection').offset().top);
        $('#userInput').text(searchTerm);
        // setCache(res.meals, type);
        $("#errorMessageContainer").remove();
        $('#searchRecipe').val(searchTerm);
    } else {
        $("#errorMessageContainer").remove();
        $('section#mealCardsSection').show();
        $("#mealCardsSection").prepend("<div id='errorMessageContainer' style='display:flex;'> <p id='errorMessageText'>No recipes match the search term '" + searchTerm + "'</p> <a id='errorMessageBtn' class='button' href='#landing' title='Search again' >Search again</a> </div>");
        window.scrollTo(0,$('#mealCardsSection').offset().top);
    }
}


// Function to generate the random meal UI component
const createMeal = ($meal, type) => {

    // Set meal thumbnail
    setMealThumbnail($meal,type);

    let mealMetadata = '', mealInstr = '';

    // Fill meal name 
    mealMetadata += `<span>Name:</span>
        ${$meal.find('title').first().text()} 
        <br/>`
    console.debug(mealMetadata);
    // mealMetadata += `<span>Name:</span>
    //   ${meal.getElementsByTagName("title")[0].innerHTML} 
    //   <br/>`

    // Fill category 
    mealMetadata += `<span>Category:</span> 
        ${$meal.find("recipeCategory").text()}
        <br/>`
    // mealMetadata += `<span>Category:</span> 
    //   ${meal.getElementsByTagName("recipeCategory")[0].innerHTML}
    //   <br/>`

    // Fill ingredients
    let ingredients = [];
    getIngredients($meal, ingredients);
    if ( ingredients.length > 0 ) {
        mealMetadata +=`<br/><span>Ingredients:</span> 
        <table class="ingredients">
          ${ingredients.join('')}
        </table>`
    }

    // Set instructions
    let instructions = [];
    getInstructions($meal, instructions);
    mealInstr =`<span>Instructions:</span>
     ${instructions.join('')}`;

    
    if ( type === 'r') { 
        $('#randomMealMetadata').html(mealMetadata); 
        $('#randomMealInstructions').html(mealInstr); 
    }
}


// Gets instruction steps
const getInstructions = ($meal, instructions) => {
    let steps = $meal.find("step");
    // let steps = meal.getElementsByTagName("step");
    for( let i = 0; i < steps.length; i++ ) {
        instructions.push(`<p>step ${i}:<br/>
            ${steps[i].innerHTML}</p>`);
    }
}

// Gets ingredients of the random meal
const getIngredients = ($meal,ingredients) => {  
    let ingredientList = $meal.find("ingredient");
    // let ingredientList = meal.getElementsByTagName("ingredient");
    for( let i = 0; i < ingredientList.length; i++ ){
        ingredients.push(`
          <tr>
            <td>${ingredientList[i].getAttribute("name")}</td>
            <td>${ingredientList[i].getAttribute("amount")}</td> 
            <td>${ingredientList[i].getAttribute("unit")}</td>
          </tr>`
        );
    }
    ingredients.push('<br/>');
}

// Sets random meal's thumbnail image
const setMealThumbnail = ($meal,type) => {
    let img = $meal.find("thumbnail").text();
    let title = $meal.find("title").text();
    // let img = meal.getElementsByTagName("thumbnail")[0].innerHTML;
    // let title = meal.getElementsByTagName("title")[0].innerHTML;
    let imgSrc = `<img src="${img}" alt="${title} thumbnail"/>`;
    if ( type === 'r') { $('#randomMealImg').html(imgSrc); }
}


// Creates meal cards.  meals is narroewed to match search
function createMealCards(shortlist) {
    let mealCards = '';
    console.debug(shortlist);

    for ( i = 0; i < recipeList.length; i++ ) {
        let title = recipeList[i].getElementsByTagName("title")[0].innerHTML;
        if ( shortlist.includes(title) ) {
            let serializer = new XMLSerializer();
            let mealData = serializer.serializeToString(recipeList[i]);
            let img = recipeList[i].getElementsByTagName("thumbnail")[0].innerHTML;
            mealCards += 
            `<div class="four columns"><div class="card">
                <img src="${img}" alt="${title} thumbnail" class="u-max-full-width" />
                <div class="card-body">
                    <div class="cardTitle">${title}</div>
                    <button class="button mealCardRecipeBtn" data-meal='${mealData}'>Recipe</button>
                </div>
            </div></div>`;
        }
    }
    $('section#random').hide();
    $('section#mealCardsSection').show();
    $('.mealCards').html(mealCards);
}

