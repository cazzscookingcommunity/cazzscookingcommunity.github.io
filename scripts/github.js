
var github = `https://api.github.com`
var headers = {}
const owner = 'cazzscookingcommunity'
const repo = 'cazzscookingcommunity.github.io'


// user entered GitHub access token
async function done() { 
    console.debug("clicked OK");
    
    // update windows
    document.getElementById("popup").style.display = "none";
    document.getElementById("commit").style.display = "block";
    
    
    // load user entered GitHub Personal Access Token
    githubToken = document.getElementById("passcode").value;
    if ( githubToken == null ) { cancel() }
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        'authorization': `Token ${githubToken}`
    }
    
    // retrieve updated file and meta data
    const recipeupdate = decodeURI ( sessionStorage.getItem('recipeupdate') );
    console.debug(recipeupdate);    
    parser = new DOMParser();
    recipeXML = parser.parseFromString(recipeupdate,"text/xml");
    filename = recipeXML.getElementsByTagName("filename")[0].innerHTML;
    console.debug(recipeupdate);
    console.debug(recipeXML);
    
    // commit changes yo GitHub
    const sha =  await getSHA(filename);
    await postFile(recipeupdate, filename, sha);
    // window.close('/pages/github.html');
};

// user selected cancel
function cancel() { 
    window.close('/pages/github.html');
};

// get SHA if exiting receipe or set to null
async function getSHA(filename) {
    let x = 0;

    const path = "recipes/"
    const endpoint = `/repos/${owner}/${repo}/contents/${path}`;
    const response = await fetch(github+endpoint, {
        "headers": headers,
        "method": "GET",
    })
    const data = await response.json();
    existingRecipe = data.find(recipe => recipe.name == filename);
    console.debug(data);
    console.debug(existingRecipe);
    if ( existingRecipe ) {
        console.debug(existingRecipe);
        sha =  existingRecipe.sha;
    } else {
        console.debug("new recipe");
        sha = "";
    }
    console.debug(`"${sha}"`);
    return ( sha );
}

// commit change 
async function postFile(recipe, filename, sha) {
    console.debug("postFile");
    console.debug(`${sha}`)
    console.debug(filename);
    const path = `recipes/${filename}`;
    const body = JSON.stringify({
        "content": btoa(recipe),
        "message": "Web Form recipe update",
        "branch": "master",
        "sha": `${sha}`
    })

    let endpoint = `/repos/${owner}/${repo}/contents/${path}`;
    console.debug(github+endpoint);

    const response = await fetch(github+endpoint, {
        "headers": headers,
        "method": "PUT",
        "body": body
    })
    const data = await response.json()
    console.debug(data);   
}
