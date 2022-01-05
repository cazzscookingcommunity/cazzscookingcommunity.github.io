# Cazz's Cooking Community
A food recipes website for all of Cazz's favourite family recipes.

We have a family of 5 adults and many friends and mouths to feed.  This is a collection of family favourites collected over the years and recorded to pass onto family and friends.


---

## The Tech stuff

All recipes will be in XML format with 1 recipe per file.
Website is HTML5 compatible.

### customisatiomns to xsd2html2xml 
1 - handler/simple-elements.xsl
        L269. convert recipe steps from html input field to textarea
        ```<!-- <xsl:when test="contains($pattern,'\n')"> -->
        <xsl:when test="$id='step'">```

2 - js/xml-generators.xsl
        L44.  add newlines into xml file generated from form
        <!-- return String.fromCharCode(60).concat("?xml version=\"1.0\"?").concat(String.fromCharCode(62)).concat(getXML(root, false, namespaceString.trim())); -->
        return String.fromCharCode(60).concat("?xml version=\"1.0\"?").concat(String.fromCharCode(62)).concat("\n").concat(getXML(root, false, namespaceString.trim()));

        L59.
        <!-- }()).concat(String.fromCharCode(60)).concat("/").concat(o.getAttribute("data-xsd2html2xml-name")).concat(String.fromCharCode(62)); -->
        }()).concat(String.fromCharCode(60)).concat("/").concat(o.getAttribute("data-xsd2html2xml-name")).concat(String.fromCharCode(62)).concat("\n");
3 - config.xsl
        added CSS, Javascript function to call.  
								

