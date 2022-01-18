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