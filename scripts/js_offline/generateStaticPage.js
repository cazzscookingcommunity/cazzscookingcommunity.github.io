const puppeteer = require('puppeteer');
const fs = require('fs');
// const url = `file:///Users/chriscullin/Library/CloudStorage/OneDrive-Personal/Code/Cooking/allRecipes.html`;

// Custom delay function
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // URL for Live Server or local file
    const url = 'http://127.0.0.1:5501/allRecipes.html';
    
    console.log('Navigating to URL:', url);

    // Open the page
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Wait for the JavaScript to finish adding the content
    await page.waitForSelector('#mealCardsSection'); // Adjust this to the specific element added by your JavaScript

    // Custom delay to ensure all content is fully rendered
    await delay(1000); // Wait for 1 second

    // Get the fully rendered HTML
    const content = await page.content();

    // Save the rendered HTML to a new file
    fs.writeFileSync('staticAllRecipes.html', content);

    await browser.close();
    console.log('Static page generated successfully!');
  } catch (error) {
    console.error('Error generating static page:', error);
  }
})();
