const recipeDir = '/recipes/';
var $recipe;



$(document).ready(function() {		
	if( window.location.search != "" ){
        const urlParams = new URLSearchParams(window.location.search);
        const recipe = urlParams.get('recipe');
        console.debug(recipe);
		loadRecipe(recipeDir + recipe);
	}
});


function loadRecipe(recipeFile){
    console.debug(recipeFile);
    fetch(recipeFile)
    .then(res => res.text())
    .then(res => new DOMParser().parseFromString(res, "text/xml"))
    .then(res => {
        recipe = res.querySelectorAll('recipe');
        $recipe = $( recipe );
        console.debug($recipe);
        createMeal($recipe, 'r');
        // setCache(res, type);
        $('section#random').show();
        window.scrollTo(0,$('#main').offset().top);
        $('#dynamicTitle').text($recipe.find('title').first().text());
    })
    .catch( e => console.warn(e) );
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