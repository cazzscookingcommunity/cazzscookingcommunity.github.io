var files2display = [];
var $recipelist;
const recipedir = "/recipes/";
const srcfile = "/xml/recipeList.xml";
const recipexsd = "/xml/recipe.xsd";


$(document).ready(function(){
    fetch(srcfile)
    .then(res => res.text())
    .then(res => new DOMParser().parseFromString(res, "text/xml"))
    .then(res => {
        let xmlDoc = new DOMParser();
        xmlDoc = res.querySelectorAll('recipe');
        $recipelist = $( xmlDoc );
        
        // build alphabetical list of filenames
        createFileList();
        displayList();
    });
});


function getStatus(filename) {
    return('status-unknown');
}



function createFileList() {
    files = $recipelist.find('filename');
    for ( let i = 0; i < files.length; i ++ ) {
        filename = files[i].innerHTML;
        files2display.push({name: filename, status:getStatus(filename)});
    };
    
    files2display.sort(function(a, b){
        let x = a.name.toLowerCase();
        let y = b.name.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
      });
};


function fileOpen(file) {
    fetch(file)
    .then(res => res.text())
    .then(res => new DOMParser().parseFromString(res, "text/xml"))
    .then(res => {
        let xmlDoc = new DOMParser();
        xmlDoc = res.querySelectorAll('recipe');
        $recipelist = $( xmlDoc );
        
        // build alphabetical list of filenames
        createFileList();
        displayList();
    });

}



function displayList() {
    
    tabledata = "";

    tabledata += `<a href=${recipexsd}>CREATE NEW RECIEPE</a>`;    
    tabledata += `<table>
        <tr>
            <th>Update Existing Recipe</th> <th>xml valid?</th>
        </tr>`;

    

    
    for ( i = 0; i < files2display.length; i++ ) {
        const filename =  files2display[i].name;
        const xmlstatus = files2display[i].status;
        file = recipedir + filename;
        tabledata += `<tr><td><a href=${file}>${filename}</a></td>`;
        tabledata += `<td>${xmlstatus}</td></tr>`;
    }

    tabledata += `</table>`;

    $("#filelist").html(tabledata);
}
