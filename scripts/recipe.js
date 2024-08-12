const recipeDir = 'recipes/';
const xslFile = 'xml/recipe.xsl';
var $recipe = 'blank';

document.addEventListener("DOMContentLoaded", function() {
    if (window.location.search !== "") {
        const urlParams = new URLSearchParams(window.location.search);
        const recipe = urlParams.get('recipe');
        console.debug(recipe);
        loadRecipe(recipeDir + recipe);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const homeButton = document.getElementById('homeButton');
    if (homeButton) {
        homeButton.addEventListener('click', function(event) {
            event.preventDefault();
            clearSearchStatus();
            window.location.href = '/index.html';
            console.debug('event listender added to Homebutton successfully.');
        });
    } else {
        console.debug('Home button does not exist in the DOM.');
    }
    console.debug('add event listener completed');
});

function loadRecipe(recipeFile) {
    console.debug("Loading recipe file:", recipeFile);
    fetch(recipeFile)
        .then(res => res.text())
        .then(res => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(res, "text/xml");
            console.debug("XML Document loaded:", xmlDoc);

            // Fetch the XSLT file
            fetch(xslFile)
                .then(xsltRes => xsltRes.text())
                .then(xsltText => {
                    const xsltDoc = parser.parseFromString(xsltText, "application/xml");
                    console.debug("XSLT Document loaded:", xsltDoc);

                    const xsltProcessor = new XSLTProcessor();
                    xsltProcessor.importStylesheet(xsltDoc);

                    // transform xml into html using the xslt file
                    const resultDocument = xsltProcessor.transformToDocument(xmlDoc);
                    console.debug("Transformation result:", resultDocument);
                    
                    if (resultDocument) {
                        const headContent = resultDocument.querySelector('head');
                        const recipeContent = resultDocument.querySelector('section#recipe');

                        if (headContent) {
                            document.head.innerHTML = headContent.innerHTML;
                        }
                        if (recipeContent) {
                            document.getElementById('recipe').innerHTML = recipeContent.innerHTML;
                        }                      
                    } else {
                        console.warn("Transformation result is null.");
                    }
                })
                .catch(e => console.warn("Error loading XSLT:", e));
        })
        .catch(e => console.warn("Error loading XML:", e));
}

function shareRecipe() {
    if (navigator.share) {    
        navigator.share({
            title: document.title,
            text: "Check out this recipe!",
            url: window.location.href
        }).then(() => {
            console.log("Thanks for sharing!");
        }).catch(err => {
            console.error("Error sharing:", err);
        });
    } else {
        alert("Web Share API not supported in this browser.");
    }
}

function printRecipe() {
    window.print();
}

function clearSearchStatus() {
    console.log("clearing search status");
    sessionStorage.removeItem('searchTerm'); // Clear search term
    sessionStorage.removeItem('searchResults'); // Clear search results

}
