
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

// July 2024 changed loadRecipe to use XSLT rather than 
// parsing the XML recipe within JS functions.
function loadRecipe(recipeFile) {
    console.debug(recipeFile);
    fetch(recipeFile)
        .then(res => res.text())
        .then(res => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(res, "text/xml");

            // Fetch the XSLT file
            fetch('/xml/recipe.xslt')
                .then(xsltRes => xsltRes.text())
                .then(xsltText => {
                    const xsltDoc = parser.parseFromString(xsltText, "application/xml");
                    const xsltProcessor = new XSLTProcessor();
                    xsltProcessor.importStylesheet(xsltDoc);

                    const resultDocument = xsltProcessor.transformToFragment(xmlDoc, document);
                    document.getElementById('random').innerHTML = '';
                    document.getElementById('random').appendChild(resultDocument);

                    // Scroll to the main content
                    window.scrollTo(0, $('#random').offset().top);
                })
                .catch(e => console.warn(e));
            let recipe = xmlDoc.querySelectorAll('recipe');
            let $recipe = $( recipe );
            addPageMetaData($recipe);
        })
        .catch(e => console.warn(e));
}




// original loadRecipe function that loaded and parsed the XML recipe.
// function name change to old_loadRecipe
// function old_loadRecipe(recipeFile){
//     console.debug(recipeFile);
//     fetch(recipeFile)
//     .then(res => res.text())
//     .then(res => new DOMParser().parseFromString(res, "text/xml"))
//     .then(res => {
//         recipe = res.querySelectorAll('recipe');
//         $recipe = $( recipe );

//         addPageMetaData($recipe);
//         createMeal($recipe, 'r');
//         $('section#random').show();
//         window.scrollTo(0,$('#main').offset().top);
//         $('#dynamicTitle').text($recipe.find('title').first().text());
//     })

//     .catch( e => console.warn(e) );
// }

function addPageMetaData($recipe) {
    const title = $recipe.find('title').first().text();
    const image = $recipe.find('thumbnail').text();
    const ingredients = $recipe.find('ingredient').text()
    const instructions = $recipe.find('step').text()
    var sitemap_data = `
        {
        "@context": "https://schema.org/",
        "@type": "Recipe",
        "name": "${title}",
        "author": {
            "@type": "Person",
            "name": "Carolyn Cullin"
        },
        "image": "${image}",
        "description": "${title}"
        }`;
        // "recipeIngredient": "${ingredients}",
        // "recipeInstructions": "${instructions}"
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.textContent = sitemap_data;
    document.head.appendChild(script);
}

// Function to generate the random meal UI component
// const createMeal = ($meal, type) => {

//     // clear any existing display data
//     $('#randomMealMetadata').empty();
//     $('#randomMealInstructions').empty();
//     $('#randomMealImg').empty();
//     // $('#dynamicTitle').empty();
    

//     // Set meal thumbnail
//     setMealThumbnail($meal,type);

//     let mealMetadata = '', mealInstr = '';

//     // Fill meal name 
//     const title = $meal.find('title').first().text()
//     mealMetadata += `<span>Name:</span>
//         ${title} 
//         <br/>`

//     // Fill category 
//     mealMetadata += `<span>Category:</span> 
//         ${$meal.find("category").text()}
//         <br/>`

//     // Fill ingredients
//     let ingredients = [];
//     getIngredients($meal, ingredients);
//     if ( ingredients.length > 0 ) {
//         mealMetadata += `<br><span>Ingredients:</span><br>
//         ${ingredients.join('')}`
//         // <ul> ${ingredients.join('')} </ul>`
//     }



//     // Set action buttons:
//     const file = $meal.find('filename').first().text();
//     const recipeactions =`
//         <a href="mailto:?subject=https://cazzscookingcommunity.io/recipe.html?recipe=${file}">
//             <img class="cardAction" border="0" alt="email recipe" src="/components/icons8-mail-24.png">
//         </a>
//         <img class="cardAction" border="0" alt="edit recipe" onclick="window.open('${recipeDir}${file}')" src="/components/icons8-edit-24.png">
//         `;


//     // Set up instructions to load Recipe Instructions
//     let instructions = [];
//     getInstructions($meal, instructions);
//     mealInstr =`<span>Instructions:</span><br>
//      ${instructions.join('')}`;
    
//     if ( type === 'r') { 
//         $('section#random').show();
//         $('#randomMealMetadata').html(mealMetadata); 
//         $('#randomMealActions').html(recipeactions);
//         $('#randomMealInstructions').html(mealInstr); 
//         $('title').html(title);
//         console.debug(window.location.href);
//     }
// }

// structure Recipe Instructions into list
// const setInstructionList = (steps, outputStr) => {
//     let i = 0;
//     outputStr.push('<ul>');
//     for( i = 0; i < steps.length; i++ ){
//         let step = steps[i].innerHTML
//         outputStr.push(`<p>step ${i}:<br/>${steps[i].innerHTML}</p>`);
//     }
//     outputStr.push('</ul>');
// }

// Gets Recipe Instruction steps
// const getInstructions = ($meal, outputStr) => {
//     let instructionsArr = [];
//     // check if recipe has Parts 
//     let parts = $meal.find("part");
//     if ( parts.length > 1 ) {
//         for ( let i = 0; i < parts.length; i++ ) {
//             title = parts[i].getElementsByTagName('title')[0].innerHTML;
//             outputStr.push(`<strong><u>${title}</u></strong>`);
//             instructionsArr = parts[i].getElementsByTagName("step");
//             setInstructionList(instructionsArr, outputStr);
//         }
//     } else {
//         instructionsArr = $meal.find("step");
//         setInstructionList(instructionsArr, outputStr);
//     }
// }

// structure Recipe Ingredients into list
// const setIngredientList = (ingredientsArr, outputStr) => {
//     let i = 0;
//     outputStr.push('<ul>');
//     for( i = 0; i < ingredientsArr.length; i++ ){
//         ingredient = ingredientsArr[i].innerHTML
//         outputStr.push(`<li>${ingredient}</li>`);
//     }
//     if ( !( i % 2 === 0 )) { 
//         outputStr.push('<li> </li>'); 
//     }
//     outputStr.push('</ul>');
// }


// Gets Recipe Ingredients of the random meal
// const getIngredients = ($meal,outputStr) => { 
//     console.log($meal);
//     let ingredientsArr = [];
//     // check if recipe has Parts 
//     let parts = $meal.find("part");
//     if ( parts.length > 1 ) {
//         for ( let i = 0; i < parts.length; i++ ) {
//             title = parts[i].getElementsByTagName('title')[0].innerHTML;
//             outputStr.push(`<strong><u>${title}</u></strong>`);
//             ingredientsArr = parts[i].getElementsByTagName("ingredient");
//             setIngredientList(ingredientsArr, outputStr);
//         }
//     } else {
//         ingredientsArr = $meal.find("ingredient");
//         setIngredientList(ingredientsArr, outputStr);
//     }
// }  

// get meal thumbnail image
// const setMealThumbnail = ($meal,type) => {
//     const img = $meal.find("thumbnail").text();
//     const title = $meal.find("title").text();
//     const file = $meal.find('filename').text();

//     if ( type === 'r') { 
//         // let imgSrc = `<img src="${img}" alt="${title} thumbnail" onclick="window.open('${recipeDir}${file}')"/>`;
//         let imgSrc = `<img src="${img}" alt="${title} thumbnail" />`;
//         $('#randomMealImg').html(imgSrc);    
//     }
// }