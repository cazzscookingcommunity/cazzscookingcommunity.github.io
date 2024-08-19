# Cazz's Cooking Community
An XML based recipe website.

all recipes are in individual xml files and have an associated image.
[/recipes/xml](/recipes) - each recipe is an individual xml file
[/recipes/images](/images) - each recipe has a single 4:3 image that is referenced in the XML file
[/xml](/recipe.xsd) - recipt format is defined by xsd file.

The site includes a fork of xsd2html2xml, which is used to translate recipe.xsd into a html Form, which allows recipes to be created and edited directly on the site.    Users with authorised Personal Access Token can push recipes direct to Git and this triggers Actions to update the following files.

[/components]/(search_index.json)
[/recipes/html](/recipe.html)
(/recipe-all.html)
(/sitemap.xml)

Github Actions are defined by [.gutbub/workflows/](build-recipe-index.yml)

---
## The Tech stuff

xsd2htmlxml translates the XML recipe into a editable html Form using the recipe.xsd definition and [xml/xsd2html2xml/](config.xsl) is the config file for xsd2html2xml.

Beyond this there some minor customisations to suit the use.  These customisatios are detailed below, but these should not be required as this repo is complete and includes xsd2html2xml.


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

3 - xsd2htmlxml.xsl  (this file controls the recipe update and add new pages)
        L303-310 or there abouts.  Change the format of the submit button and added a close button.
        Formatting for these is in admin.css
								

