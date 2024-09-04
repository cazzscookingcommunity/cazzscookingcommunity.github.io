// SEARCH RELATED FUNCTIONS


// Search
function searchRecipes(searchTerm) {
    const results = idx.search(searchTerm);
    searchTerm = searchTerm === "" ? "all" : searchTerm;
    saveSearchState(searchTerm, results); 
    console.debug("search term: ", searchTerm);
    
    // Fetch the results from the index
    const searchResult = results.map(result => {
        return recipeList.find(doc => doc.id === result.ref);
    });
    console.debug("search results: ", searchResult);
    displaySearchResults(searchResult, searchTerm);
}


// save the search query and results for back function
function saveSearchState(searchTerm, results) {
    sessionStorage.setItem('searchTerm', searchTerm);
    sessionStorage.setItem('searchResults', JSON.stringify(results));
}


// restore the search state on page reload after back function
function restoreSearchState() {
    const savedSearchTerm = sessionStorage.getItem('searchTerm');
    const savedResults = sessionStorage.getItem('searchResults');

    if (savedSearchTerm && savedResults) {
        const results = JSON.parse(savedResults);
        const recipeNameShortList = results.map(result => {
            return recipeList.find(doc => doc.id === result.ref);
        });

        // Show the relevant sections
        $('#searchRecipe').val(savedSearchTerm);
        createMealCards(recipeNameShortList);
        $('section#mealCardsSection').show();
        $('#mealCardsSection .container').show();

        // Navigate to the #mealCardsSection
        window.location.href = '#mealCardsSection';
    }
}

// this is part of preserving search state for the back function
function updateHistoryState(searchTerm, results) {
    window.history.pushState({ searchTerm, searchResults: results }, '', `?search=${encodeURIComponent(searchTerm)}`);
}

// displays the search results
function displaySearchResults(searchResult, searchTerm) {
    $("#errorMessageContainer").remove();
    $('#searchRecipe').val(searchTerm);
    $('#userInput').text(searchTerm);

    if ( searchResult.length === 0 ) {
        console.debug("search result is []");
        $('section#mealCardsSection').show();
        // $('section#random').hide();
        $('#mealCardsSection .container').show();
        $('#search-header').hide();
        $('.mealCards').html("<div id='errorMessageContainer' style='display:flex;'> <p id='errorMessageText'>No recipes match the search term '" + searchTerm + "'</p> <a id='errorMessageBtn' class='button' href='#landing' title='Search again' >Search again</a> </div>");
        window.scrollTo(0,$('#mealCardsSection').offset().top-100);
    } else {
        const mealCards = createMealCards(searchResult);
        console.debug("search results: ", mealCards);
        // $('section#random').hide();
        $('section#mealCardsSection').show();
        $('#mealCardsSection .container').show();
        $('#search-header').show();
        $('.mealCards').html(mealCards);        
    }
}

function searchByTag(tag) {
    $('#searchRecipe').val(decodeURIComponent(tag));
    searchRecipes(decodeURIComponent(tag));
}

// search tips popup
document.querySelectorAll('.info-container').forEach(function(container) {
    let pressTimer;

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        // Desktop: Hover logic
        container.addEventListener('mouseover', function() {
            const popup = container.querySelector('.info-popup');
            popup.style.display = 'block';
            const rect = container.getBoundingClientRect();
            popup.style.left = `${rect.left + (rect.width / 2) - (popup.offsetWidth / 2)}px`;
            popup.style.top = `${rect.top - popup.offsetHeight - 10}px`; // Position above the icon
        });

        container.addEventListener('mouseout', function() {
            container.querySelector('.info-popup').style.display = 'none';
        });
    } else {
        // Mobile: Touch logic
        container.addEventListener('touchstart', function(e) {
            clearTimeout(pressTimer); // Clear any existing timer
            pressTimer = setTimeout(function() {
                container.classList.add('active');
                const touch = e.touches[0];
                const popup = container.querySelector('.info-popup');

                popup.style.display = 'block';
                popup.style.position = 'fixed'; // Use fixed positioning for mobile
                popup.style.left = '50%'; // Center horizontally
                popup.style.top = `${Math.max(touch.clientY - popup.offsetHeight - 20, 0)}px`; // Ensure it stays within the viewport
                popup.style.transform = 'translate(-50%, 0)'; // Center horizontally
                popup.style.zIndex = '1000'; // Ensure it's above other elements
            }, 500);
            e.preventDefault();
        });

        container.addEventListener('touchend', function() {
            clearTimeout(pressTimer);
            container.classList.remove('active');
            const popup = container.querySelector('.info-popup');
            popup.style.display = 'none'; // Hide the popup when touch ends
            popup.style.left = ''; // Reset position
            popup.style.top = ''; // Reset position
        });

        container.addEventListener('touchcancel', function() {
            clearTimeout(pressTimer);
            container.classList.remove('active');
            const popup = container.querySelector('.info-popup');
            popup.style.display = 'none'; // Hide the popup if touch is canceled
            popup.style.left = ''; // Reset position
            popup.style.top = ''; // Reset position
        });
    }
});