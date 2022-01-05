// javascript code used by xsd2html2xml code.
// linked in /xml/xsd2html2xml/config.xsl


// recipe file header
header = ['<recipe',
    '    xmlns="https://cazzscookingcommunity.github.io"', 
    '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ',
    '    xsi:schemaLocation="https://cazzscookingcommunity.github.io /xml/recipe.xsd"> ',
    '    ']

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


function download(file) {
    doc = new DOMParser().parseFromString(file,"text/xml");
    filename = doc.getElementsByTagName('filename')[0].innerHTML;

    const str = preparefile(file.split('\n'))

    // const element = document.createElement('a');
    // element.setAttribute('href', 'data:text/text;charset=utf-8,' + file);
    // element.setAttribute('download', filename);
    // element.style.display = 'none'; 

    // var bb = new Blob([filenl ], { type: 'text/xml' });
    var a = document.createElement('a');
    a.download = filename;
    // a.href = window.URL.createObjectURL(bb);
    // a.href = 'data:text/plain;charset=utf-8,' + str;
    a.href = 'data:text/xml;charset=utf-8,' + encodeURI(str);
    a.click();
}

