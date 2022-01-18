var searchTree = {};
var recipeList = new DOMParser();
var $recipeList;
var path = "/recipes/";
var XMLrecipelist = "/xml/recipeList.xml";
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
    console.debug($meal);
    recipeFilename = $meal.find('filename').text()
    console.debug( recipeFilename );
    location.assign(`/pages/recipe.html?recipe=${recipeFilename}`)
    // window.scrollTo(0,$('#random').offset().top);
    // $('#dynamicTitle').text($meal.find('title').first().text());
});


// aget Categories for pre-defined search filters 
function getCategorys($recipe, cssSelector, newlist) {
    x = $recipe.find(cssSelector);
    for ( let i = 0; i < x.length; i++ ) {
        y = x[i].innerHTML.split(" ");  // handle space separated elements like <title>
        for ( let j = 0; j < y.length; j++ ) {
            cat = y[j].replace(",", "");
            cat = cat.replace("(", "");
            cat = cat.replace(")", "");
            cat = cat.replace("*", "");
            cat = cat.replace("!", "");
            cat = cat.replace("-", "");
            if ( ! ( cat == "" ) ) {
                // newlist.add(cat.toUpperCase());
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

// aget Categories for pre-defined search filters 
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
        getSearchValues($recipeList[i], "category, diet, meal, title");
    }
}    

// Uses the fetch() to request recipe
function fetchMeal($meal, type){
    let url = '';
    if ( type == 'r' ) {
        randomNo = Math.floor(Math.random() * $meal.length );
        recipeFilename = $meal[randomNo].getElementsByTagName("filename")[0].innerHTML;
        url = (path + recipeFilename);
    } else {
        url = (path + $meal.find('filename').text());
    }

    fetch(url)
    .then(res => res.text())
    .then(res => new DOMParser().parseFromString(res, "text/xml"))
    .then(res => {
        recipe = res.querySelectorAll('recipe');
        $recipe = $( recipe );
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

// fetch meals matching searchTerm
function fetchCategoryMeal(searchTerm){
    let recipeNameShortList = searchTree[searchTerm.toUpperCase()];
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


// Function to generate the random meal UI component
const createMeal = ($meal, type) => {

    // clear any existing display data
    $('#randomMealMetadata').empty();
    $('#randomMealInstructions').empty();
    $('#randomMealImg').empty();
    // $('#dynamicTitle').empty();
    

    // Set meal thumbnail
    setMealThumbnail($meal,type);

    let mealMetadata = '', mealInstr = '';

    // Fill meal name 
    mealMetadata += `<span>Name:</span>
        ${$meal.find('title').first().text()} 
        <br/>`

    // Fill category 
    mealMetadata += `<span>Category:</span> 
        ${$meal.find("category").text()}
        <br/>`

    // Fill ingredients
    let ingredients = [];
    getIngredients($meal, ingredients);
    if ( ingredients.length > 0 ) {
        mealMetadata += `<br><span>Ingredients:</span><br>
        ${ingredients.join('')}`
        // <ul> ${ingredients.join('')} </ul>`
    }

    // Set instructions
    let instructions = [];
    getInstructions($meal, instructions);
    mealInstr =`<span>Instructions:</span><br>
     ${instructions.join('')}`;
    
    if ( type === 'r') { 
        $('section#random').show();
        $('#randomMealMetadata').html(mealMetadata); 
        $('#randomMealInstructions').html(mealInstr); 
        console.debug(window.location.href);
    }
}

// structure instructions into list
const setInstructionList = (steps, outputStr) => {
    let i = 0;
    outputStr.push('<ul>');
    for( i = 0; i < steps.length; i++ ){
        step = steps[i].innerHTML
        outputStr.push(`<p>step ${i}:<br/>${steps[i].innerHTML}</p>`);
    }
    outputStr.push('</ul>');
}

// Gets instruction steps
const getInstructions = ($meal, outputStr) => {
    let instructionsArr = [];
    // check if recipe has parts 
    let parts = $meal.find("part");
    if ( parts.length > 1 ) {
        for ( let i = 0; i < parts.length; i++ ) {
            title = parts[i].getElementsByTagName('title')[0].innerHTML;
            outputStr.push(`<strong><u>${title}</u></strong>`);
            instructionsArr = parts[i].getElementsByTagName("step");
            setInstructionList(instructionsArr, outputStr);
        }
    } else {
        instructionsArr = $meal.find("step");
        setInstructionList(instructionsArr, outputStr);
    }
}

// structure ingredients into list
const setIngredientList = (ingredientsArr, outputStr) => {
    let i = 0;
    outputStr.push('<ul>');
    for( i = 0; i < ingredientsArr.length; i++ ){
        ingredient = ingredientsArr[i].innerHTML
        outputStr.push(`<li>${ingredient}</li>`);
    }
    if ( !( i % 2 === 0 )) { 
        outputStr.push('<li> </li>'); 
    }
    outputStr.push('</ul>');
}


// Gets ingredients of the random meal
const getIngredients = ($meal,outputStr) => { 
    console.log($meal);
    let ingredientsArr = [];
    // check if recipe has parts 
    let parts = $meal.find("part");
    if ( parts.length > 1 ) {
        for ( let i = 0; i < parts.length; i++ ) {
            title = parts[i].getElementsByTagName('title')[0].innerHTML;
            outputStr.push(`<strong><u>${title}</u></strong>`);
            ingredientsArr = parts[i].getElementsByTagName("ingredient");
            setIngredientList(ingredientsArr, outputStr);
        }
    } else {
        ingredientArr = $meal.find("ingredient");
        setIngredientList(ingredientArr, outputStr);
    }
}  

// get meal thumbnail image
const setMealThumbnail = ($meal,type) => {
    const img = $meal.find("thumbnail").text();
    const title = $meal.find("title").text();
    const file = $meal.find('filename').text();

    let imgSrc = `<img src="${img}" alt="${title} thumbnail" onclick="window.open('${path}${file}')"/>`;
    if ( type === 'r') { $('#randomMealImg').html(imgSrc); }
}


// Create meal cards for shortlisted recipes
function createMealCards(shortlist) {
    let mealCards = '';

    for ( i = 0; i < recipeList.length; i++ ) {
        let title = recipeList[i].getElementsByTagName("title")[0].innerHTML;
        if ( shortlist.includes(title) ) {
            let serializer = new XMLSerializer();
            let mealData = serializer.serializeToString(recipeList[i]);
            let img = recipeList[i].getElementsByTagName("thumbnail")[0].innerHTML;
            let file = recipeList[i].getElementsByTagName("filename")[0].innerHTML;

            mealCards += 
            `<div class="four columns"><div class="card">
                <img src="${img}" alt="${title} thumbnail" onclick="window.open('${path}${file}')" class="u-max-full-width" />
                <div class="card-body">
                    <div class="cardTitle">${title}</div>
                    <button class="button mealCardRecipeBtn" data-meal='${mealData}'>Recipe</button>
                </div>
            </div></div>`;
        }
    }
    $('section#random').hide();
    $('section#mealCardsSection').show();
    $('#mealCardsSection .container').show();
    $('.mealCards').html(mealCards);
}

