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