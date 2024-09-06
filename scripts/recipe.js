
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
    // intended to validate the format of the recipe.
}

document.addEventListener('DOMContentLoaded', () => {
    let button = document.getElementsByClassName('favourite')[0];
    let recipeId = button.id;
    updateFavouriteButton(recipeId);
    checkRecipeFormat(recipeId);
    
    // Call the function to fetch diet and nutrition info
    fetchDietAndNutritionInfo();
});

function fetchDietAndNutritionInfo() {
    const ingredients = [
        "2-3 Tbsp olive oil", 
        "2-3 garlic cloves crushed", 
        "Pinch of chili", 
        "2-4 celery stalks chopped", 
        "1-2 carrots chopped", 
        "1 cup white wine", 
        "6 cups water", 
        "2 stock cubes", 
        "2 cans chopped tomatoes", 
        "salt and pepper to taste", 
        "1 cup ricotta cheese (optional)", 
        "4 eggs (optional)", 
        "4 slices stale bread (optional)", 
        "Any Italian herbs (parsley or basil) you have on hand (optional)"
    ];

    const apiUrl = `https://api.edamam.com/api/nutrition-details?app_id=056daadb&app_key=b39f104d7fe033811500a3ce94c73a81`;

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'Acquacotta', ingr: ingredients }),
    })
    .then(response => response.json())
    .then(data => {
        displayDietAndNutritionInfo(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        document.getElementById('diet-nutrition-info').style.display = 'block';
        document.getElementById('diet-labels').textContent = 'Error loading data';
        document.getElementById('health-labels').textContent = 'Error loading data';
        document.getElementById('allergens').textContent = 'Error loading data';
        document.getElementById('calories').textContent = 'Error loading data';
        document.getElementById('macros').textContent = 'Error loading data';
    });
}

function displayDietAndNutritionInfo(data) {
    document.getElementById('diet-nutrition-info').style.display = 'block';

    const dietLabels = data.dietLabels.join(', ') || 'None';
    const healthLabels = data.healthLabels.join(', ') || 'None';
    const calories = data.calories ? `${data.calories.toFixed(2)} kcal` : 'N/A';
    const macros = `Protein: ${data.totalNutrients.PROCNT.quantity.toFixed(2)}g, Carbs: ${data.totalNutrients.CHOCDF.quantity.toFixed(2)}g, Fat: ${data.totalNutrients.FAT.quantity.toFixed(2)}g`;

    // Displaying allergens as an example; adapt based on API response specifics
    const allergens = data.healthLabels.includes('Dairy-Free') ? 'Dairy-Free' : 'Contains Dairy';

    document.getElementById('diet-labels').textContent = dietLabels;
    document.getElementById('health-labels').textContent = healthLabels;
    document.getElementById('allergens').textContent = allergens;
    document.getElementById('calories').textContent = calories;
    document.getElementById('macros').textContent = macros;
}

