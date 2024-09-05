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
        if ( searchTerm == "My Favourites" ) {
            $('#searchRecipe').val("");
            window.scrollTo(0, $('#main').offset().top); //
        } else {
            $('#searchRecipe').val(searchTerm);
            window.scrollTo(0, $('#mealCardsSection').offset().top); // Scroll #mealCardsSection
        }    
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
        // Desktop: Hover logic (mostly handled by CSS now)
        container.addEventListener('mouseover', function() {
            container.querySelector('.info-popup').style.display = 'block'; // Simplified, let CSS handle most of the positioning
        });

        container.addEventListener('mouseout', function() {
            container.querySelector('.info-popup').style.display = 'none';
        });
    } else {
        // Mobile: Touch logic
        container.addEventListener('touchstart', function(e) {
            clearTimeout(pressTimer);
            pressTimer = setTimeout(function() {
                container.classList.add('active');
            }, 500);
            e.preventDefault();
        });

        container.addEventListener('touchend', function() {
            clearTimeout(pressTimer);
            container.classList.remove('active');
        });

        container.addEventListener('touchcancel', function() {
            clearTimeout(pressTimer);
            container.classList.remove('active');
        });
    }
});
