// javascript code used by xsd2html2xml code.
// linked in /xml/xsd2html2xml/config.xsl


// recipe file header
xmlheader = [`<?xml version="1.0" encoding="UTF-8"?>`,
    `<?xml-stylesheet type='text/xsl' href='/xml/xsd2html2xml/xsd2html2xml.xsl'?>`,
    ``]

recipeheader = ['<recipe',
    '    xmlns="https://cazzscookingcommunity.github.io"', 
    '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ',
    '    xsi:schemaLocation="https://cazzscookingcommunity.github.io /xml/recipe.xsd"> ',
    '    ']


// function closeWindow(mywindow) {
//     mywindow.close();
//     console.debug('abount to go back');
//     window.location.assign("/components/admin.html");
// }

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
            subarray.splice(0, 0, header[0], header[1],
                header[2], header[3], header[4]);
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


// save update recipe to GitHub or Download
function save(file) {
    const str = preparefile(file.split('\n'));
    sessionStorage.setItem('recipeupdate', encodeURI(str));
    var mywindow = window.open('/components/github.html','','toolbar=0,status=0,width=626,height=436');
    var timer = setInterval(checkChild, 500);

    function checkChild() {
        if (mywindow.closed) { 
            clearInterval(timer);
            window.location.replace('/components/admin.html');
        }
    }
}



