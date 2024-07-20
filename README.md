# Cazz's Cooking Community
An XML based recipe website.

all recipes are in individual xml files and have an associated image.
[/recipes](/recipes) - each recipe is an individual xml file
[/images](/images) - each recipe has a single 4:3 image that is referenced in the XML file
[/xml](/xml) - all recipes are sumarised in recipeList.xml and the recipe structured is defined by recipe.xsd

The site includes a fork of xsd2html2xml, which is used to translate recipe.xsd into a html Form, which allows recpes to be created and edited directly on the site.    Users with authorised Personal Access Token can push recipes direct to Git and this triggers Actions to update recipe.xml and sitemap.  non-authorised users can download xml files to their desktop.

---
## The Tech stuff

### Github runners 
Note:  there is a YML file in the .github directory that configures the GitHub CICD Actions
on a push event this runs to look for changes.  if changes found it regenerates the RecipeList.xml and
sitemap.xml files and publishes to github pages.

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

4 - xsd2htmlxml.xsl  (this file controls the recipe update and add new pages)
        L303-310 or there abouts.  Change the format of the submit button and added a close button.
        Formatting for these is in admin.css
								

