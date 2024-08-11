
// generate a list of all hastags for simple search
function getSearchTags(recipeList) {
    let categorySet = new Set();
    let dietSet = new Set();

    recipeList.forEach(recipe => {
        // Accumulate unique category tags
        if (recipe.category) {
            recipe.category.split(' ').forEach(tag => {
                categorySet.add(tag.trim());
            });
        }

        // Accumulate unique diet tags
        if (recipe.diet) {
            recipe.diet.split(' ').forEach(tag => {
                dietSet.add(tag.trim());
            });
        }
    });

    // Convert sets to arrays and then to HTML string with tags
    let categoryTags = Array.from(categorySet).map(tag => 
        `<a href="#mealCardsSection" class="tag navbar-link-category" onclick="searchByTag('${encodeURIComponent(tag)}')">#${tag}</a>`
    ).join(' ');

    let dietTags = Array.from(dietSet).map(tag => 
        `<a href="#mealCardsSection" class="tag navbar-link-category" onclick="searchByTag('${encodeURIComponent(tag)}')">#${tag}</a>`
    ).join(' ');

    return categoryTags + ' ' + dietTags;
}



function displaySearchTags(tags) {
    NavBarCategory.innerHTML = tags;
}





// NEED TO UPDATE FOR RECIPE DIET
// adds itemList schema to the homepage
function addPageMetaData(data) {
    let metaData = "";
    metaData += `{
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": [`;

    // Iterate over the first 10 recipes in the data array
    for (let i = 0; i < Math.min(data.length, 10); i++) {
        const filename = data[i].id; // Assuming 'id' is the filename property
        if (i > 0) {
            metaData += ',';
        }
        metaData += `{
            "@type": "ListItem",
            "position": "${i + 1}", // Schema.org expects positions to start from 1
            "url": "https://cazzscookingcommunity.github.io/recipe.html?recipe=${filename}"
        }`;
    }
    metaData += `]}`;

    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.textContent = metaData;
    document.head.appendChild(script);
}