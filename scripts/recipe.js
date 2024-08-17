const recipeDir = 'recipes/html/';

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
