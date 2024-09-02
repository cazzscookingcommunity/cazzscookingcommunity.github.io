// general functions available to all pages


// attach the clear search function to class=clearButton
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.clearButton').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); // Prevents the default action, if necessary
            clearSearch(); // Calls the clearSearch function
            window.location.href = '/index.html'; // Redirects to the home page
            console.debug('Event listener added to a clearButton successfully.');
        });
    });
});

// clear the search session tags, 
function clearSearch() {
    sessionStorage.removeItem('searchTerm'); // Clear search term
    sessionStorage.removeItem('searchResults'); // Clear search results
    
    // Clear searchRecipe value if it exists
    const searchRecipeInput = document.getElementById('searchRecipe');
    if (searchRecipeInput) {
        searchRecipeInput.value = '';
    }

    // Show meal cards section if it exists
    const mealCardsSection = document.querySelector('section#mealCardsSection');
    if (mealCardsSection) {
        mealCardsSection.style.display = 'block';

        // Hide containers within meal cards section if any
        const containers = mealCardsSection.querySelectorAll('.container');
        containers.forEach(container => {
            container.style.display = 'none';
        });
    }

    // Hide random section if it exists
    const randomSection = document.querySelector('section#random');
    if (randomSection) {
        randomSection.style.display = 'none';
    }
}

// hamburger menu for category list
function mobileMenu() {
    var navbarList = document.getElementById("navbar-list");
    if (navbarList.style.display === "flex") {
        navbarList.style.display = "none"; /* Hide the menu */
    } else {
        navbarList.style.display = "flex"; /* Show the menu */
    }
}


