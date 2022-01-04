var files2display = [];
var $recipelist;
var recipedir = "/recipes/";
var srcfile = "/xml/recipeList.xml";


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
    console.debug($recipelist);
    files = $recipelist.find('filename');
    console.debug(files);
    // recipes = $recipelist.find("recipe");
    // console.debug($recipelist.find("category"));
    for ( let i = 0; i < files.length; i ++ ) {
    // for ( let i = 0; i < 10; i ++ ) {
        filename = files[i].innerHTML;
        console.debug(filename);
        files2display.push({name: filename, status:getStatus(filename)});
    };

    console.debug(files2display);
    console.debug(files2display[0]);
    console.debug(files2display[0].name);
    console.debug(files2display[0].status);
    
    files2display.sort(function(a, b){
        let x = a.name.toLowerCase();
        let y = b.name.toLowerCase();
        // console.debug(a);
        // console.debug(b);
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

    tabledata += `<table>
    <tr>
        <th>recipe file</th>
        <th>xml valid?</th>
    </tr>`;

    console.debug(files2display);
    console.debug(files2display.length);
    
    for ( i = 0; i < files2display.length; i++ ) {
        const filename =  files2display[i].name;
        const xmlstatus = files2display[i].status;
        // console.debug(`filename: ${filename}`);
        file = recipedir + filename;
        // console.debug(`file: ${file}`);
        tabledata += `<tr><td><a href=${file}>${filename}</a></td>`;
        tabledata += `<td>${xmlstatus}</td></tr>`;
    }

    tabledata += `</table>`;

    $("#filelist").html(tabledata);
}



