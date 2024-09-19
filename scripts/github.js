
const github = `https://api.github.com`
const owner = 'cazzscookingcommunity'
const username = 'cooking@miplace.com'
const repo = 'cazzscookingcommunity.github.io'
const recipeXmlDir =  'recipes/xml/';
const recipeHtmlDir = 'recipes/html/';
const imagedir =      'recipes/images/';

var passcode = null
var headers = {}
var imageName = '';   // image name from recipe-add.html
var imageFile = '';   // the image uploaded from recipe-add.html

// recipe file header
const xmlheader = [`<?xml version="1.0" encoding="UTF-8"?>`,
    `<?xml-stylesheet type='text/xsl' href='/xml/xsd2html2xml/xsd2html2xml.xsl'?>`,
    ``]
const recipeheader = ['<recipe',
    '    xmlns="https://cazzscookingcommunity.github.io"', 
    '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ',
    '    xsi:schemaLocation="https://cazzscookingcommunity.github.io ../../xml/recipe.xsd"> ',
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

    if ( passcode == null ) {
        // ignore and do nothing
        console.debug("ignore empty passcode");
    } else {
        // diaplay busy icon
        document.getElementById('loading-spinner').style.display = 'block';
   
        // retrieve updated file and meta data
        const recipeupdate = decodeURI(sessionStorage.getItem('recipeupdate'));  
        recipeBlob = new Blob([recipeupdate], { type: 'text/xml' });
        parser = new DOMParser();
        recipeXML = parser.parseFromString(recipeupdate,"text/xml");
        recipename = recipeXML.getElementsByTagName("filename")[0].innerHTML;
        // commit changes to GitHub
        try {
            const sha =  await getSHA(recipeXmlDir, recipename);
            await postFile(recipeBlob, recipeXmlDir + recipename, sha);
            console.log("File uploaded successfully");
            
            if (window.opener) {
                // Go back in the parent's history
                window.opener.history.back();
                // Close the current (child) window
                window.close();
            } else {
                // Cannot close the window so notify user that upload is complete
                window.alert(`Recipe upload complete`);
            }

        } catch (error) {
            console.error("Error occurred:", error.message); // Logs the detailed error message
            alert(`An error occurred: ${error.message}`); // Displays the error to the user
        }
        
    }
};

function image_upload() {
    var fileInput = document.getElementById('imageFile');
    imageName = document.getElementById('imageName').value + ".jpeg";

    // console.log("fileInput:", fileInput);

    if (fileInput.files.length > 0) {
        imageFile = fileInput.files[0];
        console.log("imageFile: ", imageFile);

        // Perform the upload or further processing here
        console.log('Selected file:', imageFile);
        console.log('New filename:', imageName);
        get_token(commit_image);
    }
}

async function commit_image() {
    if (passcode != null) {
        // diaplay busy icon
        document.getElementById('loading-spinner').style.display = 'block';
  
        try {
            // Get the SHA for the existing file, if it exists
            const sha = await getSHA(imagedir, imageName);

            // Upload or update the file in GitHub
            await postFile(imageFile, imagedir + imageName, sha);

            window.location.reload();
        } catch (error) {
            // Handle any errors that occur during the upload process
            console.error('Error uploading image:', error);
            window.alert("An error occurred during the upload. Please try again.");
        }
    }
}


function confirm_delete() {
    const recipexml = document.querySelector('input[data-xsd2html2xml-description="filename"]').value;
    const recipehtml = recipexml.replace('.xml', '.html');
    const recipeimage = document.querySelector('input[data-xsd2html2xml-description="thumbnail"]').value;

    sessionStorage.setItem('recipexml', encodeURI(recipexml));
    sessionStorage.setItem('recipehtml', encodeURI(recipehtml));
    sessionStorage.setItem('recipeimage', encodeURI(recipeimage));
    console.log("confirm-delete: ", recipexml, recipehtml, recipeimage);
    
    // Confirm the action with the user
    const userConfirmed = confirm("Are you sure you want to delete this recipe? This action cannot be undone.");
    if (userConfirmed) {
        console.debug("User confirmed recipe deletion");
        try {
            get_token(delete_recipe);
        } catch (error) {
            console.error("Error occurred during deletion:", error.message);
            alert(`An error occurred: ${error.message}`);
        }
    } else {
        console.debug("User cancelled recipe deletion");
    }
}

async function delete_recipe() {
    const recipexml = decodeURI(sessionStorage.getItem('recipexml')); 
    const recipehtml = decodeURI(sessionStorage.getItem('recipehtml')); 
    const recipeimage = decodeURI(sessionStorage.getItem('recipeimage')); 
    console.log("delete-recipe: ", recipexml, recipehtml, recipeimage);

    if ( passcode == null ) {
        // ignore and do nothing
        console.debug("ignore empty passcode");
    } else {
        // diaplay busy icon
        document.getElementById('loading-spinner').style.display = 'block';

        try {
            // Get the SHA for the recipe's XML file and delete it
            const recipeXmlSha = await getSHA(recipeXmlDir, recipexml);
            await deleteFile(recipeXmlDir + recipexml, recipeXmlSha);
            console.log("Recipe XML file deleted successfully");
        } catch (error) {
            console.error("Error occurred during Recipe XML deletion:", error.message);
        }

        try {
            // Get the SHA for the recipe's image file and delete it
            const imageSha = await getSHA(imagedir, recipeimage);
            await deleteFile(imagedir + recipeimage, imageSha);
            console.log("Recipe image file deleted successfully");
        } catch (error) {
            console.error("Error occurred during Recipe Image deletion:", error.message);
        }    

        try {
            // Get the SHA for the recipe's HTML file and delete it (if it exists)
            const htmlSha = await getSHA(recipeHtmlDir, recipehtml);
            await deleteFile(recipeHtmlDir + recipehtml, htmlSha);
            console.log("Recipe HTML file deleted successfully");
        } catch (error) {
            console.error("Error occurred during REcipe HTML deletion:", error.message);
        }

        if (window.opener) {
            // Go back in the parent's history
            window.opener.history.back();
            // Close the current (child) window
            window.close();
        } else {
            // Cannot close the window so notify user that upload is complete
            window.alert(`Recipe delete complete`);
        }
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
    var popup = window.open('/components/html/popup.html','','toolbar=0,status=0,width=626,height=436');
    popup.addEventListener("unload", function (event) {
        if ( popup.closed ) {
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

    if (!response.ok) {
        const errorData = await response.json(); // Parse the response as JSON
        const message = `GitHub error occurred: ${errorData.message}`;
        console.debug(message);
        throw new Error(message);
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
async function postFile(blob, path, sha) {
    // Ensure that the file is a Blob (which includes File)
    if (!(blob instanceof Blob)) {
        throw new Error('Invalid file type: The file must be a Blob or File instance.');
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = async function () {
            // Remove the data URL prefix and get base64 content
            const base64Content = reader.result.split(',')[1];

            const body = JSON.stringify({
                "content": base64Content,
                "message": "Webform recipe update",
                "branch": "master",
                "sha": sha || ""
            });

            const endpoint = `/repos/${owner}/${repo}/contents/${path}`;

            try {
                const response = await fetch(github + endpoint, {
                    "headers": headers,
                    "method": "PUT",
                    "body": body
                });

                if (!response.ok) {
                    reject(new Error(`Failed to upload file: ${response.statusText}`));
                }

                resolve(response);
            } catch (error) {
                reject(new Error('Failed to upload file.'));
            }
        };

        reader.onerror = function () {
            reject(new Error('Failed to read file.'));
        };

        // Read the file as a DataURL (works for both images and text files)
        reader.readAsDataURL(blob);
    });
}

// DELETE FILE
async function deleteFile(path, sha) {
    if (!sha) {
        throw new Error(`No SHA found for file: ${path}`);
    }

    const body = JSON.stringify({
        "message": `Delete ${path}`,
        "sha": sha,
        "branch": "master"
    });

    const endpoint = `/repos/${owner}/${repo}/contents/${path}`;

    try {
        const response = await fetch(github + endpoint, {
            "headers": headers,
            "method": "DELETE",
            "body": body
        });

        if (!response.ok) {
            throw new Error(`Failed to delete file: ${response.statusText}`);
        }

        return response;
    } catch (error) {
        throw new Error(`Failed to delete file: ${error.message}`);
    }
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


