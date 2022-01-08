// javascript code used by xsd2html2xml code.
// linked in /xml/xsd2html2xml/config.xsl


var githubToken = ""

// recipe file header
header = ['<recipe',
    '    xmlns="https://cazzscookingcommunity.github.io"', 
    '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ',
    '    xsi:schemaLocation="https://cazzscookingcommunity.github.io /xml/recipe.xsd"> ',
    '    ']

// insert XML schema headers that have not been preserved along the way 
function preparefile(array) {
    let i = 0;
    let filestring = ""
    for ( i = 0; i < array.length; i ++ ) {
        if ( array[i].includes( "<title>" ) ) {
            subarray = array[i].split("<title>");
            subarray[1] = "<title>".concat(subarray[1]);
            subarray.splice(0,1);
            subarray.splice(0, 0, header[0], header[1],
                header[2], header[3], header[4]);
            break       
        }
    }
    array.splice(i, 1);
    for ( j = 0; j < subarray.length; j ++ ) {
        array.splice(i, 0, subarray[j]);
        i++
    }
    for ( i = 0; i < array.length; i ++ ) {
        filestring += array[i];
        filestring += "\n";
    }
    return(filestring);
}

// download the update recipe XML form
function download(file) {
    doc = new DOMParser().parseFromString(file,"text/xml");
    filename = doc.getElementsByTagName('filename')[0].innerHTML;

    const str = preparefile(file.split('\n'))
    var a = document.createElement('a');
    a.download = filename;
    a.href = 'data:text/xml;charset=utf-8,' + encodeURI(str);
    a.click();
}

// Commit updated recipe to GitHub
function commit(file) {
    console.debug(githubToken)
}

function gitUser() {

    // let text;
    // githubToken = prompt(`Please enter your GitHub token to upload recipe:
    //                       or 'OK' to download recipe`, "");
    // if (githubToken == null || githubToken == "") {
    //   return(false);
    // } else {
    //     return(true);
    // }
}

// save update recipe to GitHub or Download
function save(file) {
    mywindow = window.open('/admin/github.html');
    // if ( gitUser() ) {
    //     commit(file);
    // } else if ( githubToken != null ) {
    //     download(file);
    // }
}

function done() { 
    githubToken = document.getElementById("pass").value;
    window.history.back();

    //DO STUFF WITH githubToken HERE
    console.debug("clicked OK");
    
    console.debug(githubToken);

};

function cancel() { 

    console.debug("clicked cancel1");
    // window.history.back();
    console.debug("clicked cancel2");
};


