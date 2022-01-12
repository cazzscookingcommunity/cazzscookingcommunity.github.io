
var github = `https://api.github.com`
var headers = {}
const owner = 'cazzscookingcommunity'
const username = 'cooking@miplace.com'
const repo = 'cazzscookingcommunity.github.io'


// user entered GitHub access token
async function upload() { 
    console.debug("clicked OK");
    // update windows
    document.getElementById("popup").style.display = "none";
    document.getElementById("commit").style.display = "block";
    // load user entered GitHub Personal Access Token
    githubToken = document.getElementById("passcode").value;
    if ( githubToken == null ) { cancel() }
    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        'authorization': `Token ${githubToken}`
    }
    // retrieve updated file and meta data
    const recipeupdate = decodeURI(sessionStorage.getItem('recipeupdate'));
    console.debug(recipeupdate);    
    parser = new DOMParser();
    recipeXML = parser.parseFromString(recipeupdate,"text/xml");
    filename = recipeXML.getElementsByTagName("filename")[0].innerHTML;
    console.debug(recipeupdate);
    console.debug(recipeXML);
    // commit changes to GitHub
    const sha =  await getSHA(filename);
    await postFile(recipeupdate, filename, sha);
    sessionStorage.setItem('button', 'upload');
    window.close('/pages/github.html');
};


// get SHA if exiting receipe or set to null
async function getSHA(filename) {
    const path = "recipes/"
    const endpoint = `/repos/${owner}/${repo}/contents/${path}`;
    console.debug(filename);
    console.debug(headers);

    const response = await fetch(github+endpoint, {
        "headers": headers,
        "method": "GET",
    })

    if ( !response.ok) {
        const message  = `GitHub error has occured try again or cancel to download.  error: ${response.statusText}`
        console.debug(message);
        throw error(message);
    }

    const data = await response.json();
    console.debug(data);
    existingRecipe = data.find(recipe => recipe.name == filename);
    console.debug(existingRecipe);



    if ( existingRecipe ) {
        console.log("existing recipe");
        sha =  existingRecipe.sha;
    } else {
        console.log("new recipe");
        sha = "";
    }
    return ( sha );
}

// commit change 
async function postFile(recipe, filename, sha) {
    const path = `recipes/${filename}`;
    const body = JSON.stringify({
        "content": btoa(recipe),
        "message": "Webform recipe update",
        "branch": "master",
        "sha": `${sha}`
    })

    let endpoint = `/repos/${owner}/${repo}/contents/${path}`;
    console.debug(github+endpoint);
    console.debug(headers);
    console.debug(body);

    const response = await fetch(github+endpoint, {
        "headers": headers,
        "method": "PUT",
        "body": body
    })
    // const data = await response.json().catch(error => {
    //     document.getElementById("commit").innerHTML = error;
    // })
    // console.debug(data);   
}



// cancel upload and download
function cancel() { 
    const recipeupdate = decodeURI(sessionStorage.getItem('recipeupdate'));
    console.debug(recipeupdate);    
    parser = new DOMParser();
    recipeXML = parser.parseFromString(recipeupdate,"text/xml");
    filename = recipeXML.getElementsByTagName("filename")[0].innerHTML;

    const str = preparefile(recipeupdate.split('\n'))
    var a = document.createElement('a');
    a.addEventListener('blur',function(){
        console.debug("in event listener");
        window.close('/pages/github.html')
    });
    a.download = filename;
    a.href = 'data:text/xml;charset=utf-8,' + encodeURI(str);
    a.click();
    console.debug("at end of download)")
};



