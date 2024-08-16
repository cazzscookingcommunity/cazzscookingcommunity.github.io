var files2display = [];
var $recipelist;
// const recipedir = "/recipes/";
const recipeList = "/xml/recipeList.xml";
const recipexsd = "/xml/recipe.xsd";

// Open Recipe List index file
$(document).ready(function(){
    // fetch(recipeList)
    // .then(res => res.text())
    // .then(res => new DOMParser().parseFromString(res, "text/xml"))
    // .then(res => {
    //     let xmlDoc = new DOMParser();
    //     xmlDoc = res.querySelectorAll('recipe');
    //     $recipelist = $( xmlDoc );
        
    //     // build alphabetical list of filenames
    //     createFileList();
    //     displayList();
    // });
    displayList();
});

// validate recipe file against xsd schema
function getStatus(filename) {
    return('status not yet implemented');
}

// Create array of filename:status pairs
// function createFileList() {
//     files = $recipelist.find('filename');
//     for ( let i = 0; i < files.length; i ++ ) {
//         filename = files[i].innerHTML;
//         files2display.push({name: filename, status:getStatus(filename)});
//     };  
//     // sorts the list alphabetically
//     files2display.sort(function(a, b){
//         let x = a.name.toLowerCase();
//         let y = b.name.toLowerCase();
//         if (x < y) {return -1;}
//         if (x > y) {return 1;}
//         return 0;
//       });
// };

function displayList() {  
    tabledata = "";

    tabledata += `<button onclick="image_upload(document.getElementById('imgFname').value)">upload image</button>`;
    tabledata += `<input type="file" id="imgFname" name="image" accept="image/*">`;
    tabledata += `<br><br>`;

    tabledata += `<a href=${recipexsd}><button>CREATE NEW RECIPE</button></a>`;  
    tabledata += `<br><br>`;

    // tabledata += `<table>
    //     <tr>
    //         <th>Update Existing Recipe</th>
    //     </tr>`;
    //     // <th>Update Existing Recipe</th> <th>xml valid?</th>
    
    // for ( i = 0; i < files2display.length; i++ ) {
    //     const filename =  files2display[i].name;
    //     const xmlstatus = files2display[i].status;
    //     file = '/' + recipedir + filename;
    //     tabledata += `<tr><td><a href=${file}>${filename}</a></td>`;
    //     // tabledata += `<td>${xmlstatus}</td></tr>`;
    // }

    // tabledata += `</table>`;
    $("#newRecipe").html(tabledata);
}

