
const github = `https://api.github.com`
const owner = 'cazzscookingcommunity'
const username = 'cooking@miplace.com'
const repo = 'cazzscookingcommunity.github.io'
const recipedir = 'recipes/';
const imagedir = 'images/';

var passcode = null
var headers = {}
var image = '';   // full name and path of image to be uploaded


// recipe file header
const xmlheader = [`<?xml version="1.0" encoding="UTF-8"?>`,
    `<?xml-stylesheet type='text/xsl' href='/xml/xsd2html2xml/xsd2html2xml.xsl'?>`,
    ``]
const recipeheader = ['<recipe',
    '    xmlns="https://cazzscookingcommunity.github.io"', 
    '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ',
    '    xsi:schemaLocation="https://cazzscookingcommunity.github.io /xml/recipe.xsd"> ',
    '    ']

    

// RECIPE UPDATE
// ================================
// 

function upload_recipe(file) { 
    const str = preparefile(file.split('\n'));
    sessionStorage.setItem('recipeupdate', encodeURI(str));
    get_token(commit_recipe);
}

async function commit_recipe() {
    console.debug("commit_recipe");
    
    console.debug(`passcode = ${passcode}`);
    console.debug(passcode == null);
    console.debug(passcode == "");
    console.debug(document.getElementById('token').value);
    console.debug(headers);
    if ( passcode == null ) {
        download_recipe();
    } else {
        // retrieve updated file and meta data
        const recipeupdate = decodeURI(sessionStorage.getItem('recipeupdate'));
        console.debug(recipeupdate);    
        parser = new DOMParser();
        recipeXML = parser.parseFromString(recipeupdate,"text/xml");
        recipename = recipeXML.getElementsByTagName("filename")[0].innerHTML;
        console.debug(recipeupdate);
        console.debug(recipeXML);
        // commit changes to GitHub
        const sha =  await getSHA(recipedir, recipename);
        await postFile(recipeupdate, recipedir+recipename, sha);
        history.back();
        window.location.asign(/pages/admin.html);
    }
};

// cancel upload and download
function download_recipe() { 
    console.debug("download_recipe");
    
    const recipeupdate = decodeURI(sessionStorage.getItem('recipeupdate'));
    console.debug(recipeupdate);    
    parser = new DOMParser();
    recipeXML = parser.parseFromString(recipeupdate,"text/xml");
    filename = recipeXML.getElementsByTagName("filename")[0].innerHTML;

    const str = preparefile(recipeupdate.split('\n'))
    var a = document.createElement('a');
    a.addEventListener('blur',function(){
        console.debug("in event listener");
        // window.close('/pages/github.html')
    });
    a.download = filename;
    a.href = 'data:text/xml;charset=utf-8,' + encodeURI(str);
    a.click();
    console.debug("at end of download)")
};


//  IMAGE UPDATE
// ================================
// 

function image_upload(file) {
    image = file;
    get_token(commit_image);
}

async function commit_image() {  
    if ( passcode != null ) {
        // commit changes to GitHub
        filename = getfilename(image);
        console.debug(filename);
        const sha =  await getSHA(imagedir, filename);
        await postFile(image, imagedir+filename, sha);
        // window.close('/pages/imageupload.html');
        window.location.reload();
    }
}



// GITHUB API
// ================================
// 

// prompt for GitHub Personal Access Token.
function get_token(callback) {
    console.debug("getting token");
    passcode = null;
    var pat = document.createElement("INPUT");
    pat.type = "password";
    pat.id = "token";
    pat.value = "";
    document.body.appendChild(pat);
    var popup = window.open('/pages/popup.html','','toolbar=0,status=0,width=626,height=436');
    popup.addEventListener("unload", function (event) {
        if ( popup.closed ) {
            console.debug("popup closed");
            callback();
        }
    })
}

// get SHA if exiting receipe or set to null
async function getSHA(path, filename) {
    const endpoint = `/repos/${owner}/${repo}/contents/${path}`;
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
    existingFile = data.find(file => file.name == filename);
    if ( existingFile ) {
        console.log("existing File");
        sha =  existingFile.sha;
    } else {
        console.log("new file");
        sha = "";
    }
    return ( sha );
}

// commit change 
async function postFile(file, path, sha) {
    // const path = `files/${filename}`;
    const body = JSON.stringify({
        "content": btoa(file),
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
}


// RECIPE FILE FORMATTING
// ================================
// 

// get the filename from the fill path
function getfilename(file) {
    console.debug(file);
    const myArray = file.split("\\");
    console.debug(myArray);
    filename = myArray[myArray.length - 1];
    console.debug(filename);
    return( filename );
}

// insert missing XML headers that have not lost on the way 
function preparefile(array) {
    let i = 0;
    let filestring = ""
    //  create the recipe tag
    for ( i = 0; i < array.length; i ++ ) {
        if ( array[i].includes( "<title>" ) ) {
            subarray = array[i].split("<title>");
            subarray[1] = "<title>".concat(subarray[1]);
            subarray.splice(0,1);
            subarray.splice(0, 0, recipeheader[0], recipeheader[1],
                recipeheader[2], recipeheader[3], recipeheader[4]);
            break       
        }
    }
    //  insert the recipe tag
    array.splice(i, 1);
    for ( j = 0; j < subarray.length; j ++ ) {
        array.splice(i, 0, subarray[j]);
        i++
    }
    // replace the XML tag and add Style tag
    array.splice(0,1);
    i = 0;
    for ( j = 0; j < xmlheader.length; j ++ ) {
        array.splice(i, 0, xmlheader[j]);
        i++
    }
    //  add newline to each line
    for ( i = 0; i < array.length; i ++ ) {
        filestring += array[i];
        filestring += "\n";
    }
    return(filestring);
}


