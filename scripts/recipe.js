
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
            fetch('/xml/recipe.xsl')
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
