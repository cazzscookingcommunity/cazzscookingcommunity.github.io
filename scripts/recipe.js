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
                        const bodyContent = resultDocument.querySelector('body');

                        if (headContent) {
                            document.head.innerHTML = headContent.innerHTML;
                        }
                        if (bodyContent) {
                            document.body.innerHTML = bodyContent.innerHTML;
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
