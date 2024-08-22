
// after page loads update the favourites button
document.addEventListener('DOMContentLoaded', () => {
    let button = document.getElementsByClassName('favourite')[0];
    let recipeId = button.id;
    updateFavouriteButton(recipeId);
    checkRecipeFormat(recipeId);
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

function checkRecipeFormat(recipeId) {
    
}
