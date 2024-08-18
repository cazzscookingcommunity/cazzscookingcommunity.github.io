#!/bin/python3

""" Updates indexhtml, sitemap.xml and creates a search_index.json file

When a new recipe has been added or a recipe updated
this script is run BY GITHUB WORKFLOW to generate and updates files
listed above
"""

import os
import json
import xmlschema
from lxml import etree
import datetime

date = datetime.datetime.now().date()

# input files
xmlRecipeDir = "recipes/xml/"
indexHtmlFile = "index.html"


# output files
searchIndex = "components/search_index.json"
sitemap = "sitemap.xml"

# SITEMAP.XML TEMPLATE
sitemap_header = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

    <url>
        <loc>https://cazzscookingcommunity.github.io/index.html</loc>
        <lastmod>{}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://cazzscookingcommunity.github.io/all-recipes.html</loc>
        <lastmod>{}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>'''



sitemap_page = '''
    <url>
        <loc>https://cazzscookingcommunity.github.io/recipes/html/{}</loc>
        <image:image>
            <image:loc>https://cazzscookingcommunity.github.io/recipe/images/{}</image:loc>
        </image:image>
        <lastmod>{}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.8</priority>
    </url>'''


sitemap_footer = '''
</urlset>'''


def loadfile(filename):
    ifile = open(filename, "rt")
    istr = ifile.read()
    ifile.close()
    # print(istr)
    return istr

def initOutput(file, content):
    with open(file, "w") as dst:
        dst.write(content)
        dst.close()

def closeOutput(file, content):
    with open(file, "a") as dst:
        dst.write(content)
        dst.close()

def get_file_modified_date(file_path):
    # Get the timestamp of the last modification
    timestamp = os.path.getmtime(file_path)
    # Convert the timestamp to a datetime object
    modified_date = datetime.datetime.fromtimestamp(timestamp).date()
    return modified_date


def parse_recipe(filename):
    """Parse an XML recipe file and extract relevant fields."""
    try:
        # Parse the XML file
        tree = etree.parse(xmlRecipeDir + filename)
        root = tree.getroot()

        # Define the namespace
        namespace = {"ns": "https://cazzscookingcommunity.github.io"}

        htmlFilename = root.find("ns:htmlFilename", namespace).text if root.find("ns:htmlFilename", namespace) is not None else ""
        thumbnail = root.find("ns:thumbnail", namespace).text if root.find("ns:thumbnail", namespace) is not None else ""
                
        # Extract fields from the XML
        recipe = {
            "id": os.path.basename(xmlRecipeDir + filename),
            "title": root.find("ns:title", namespace).text if root.find("ns:title", namespace) is not None else "",
            "filename": root.find("ns:filename", namespace).text if root.find("ns:filename", namespace) is not None else "",
            "htmlFilename": htmlFilename,
            "thumbnail": thumbnail,
            "category": " ".join([elem.text for elem in root.findall("ns:category", namespace) if elem.text]),
            "diet": " ".join([elem.text for elem in root.findall("ns:diet", namespace) if elem.text]),
            "ingredients": " ".join([elem.text for elem in root.findall("ns:ingredient", namespace) if elem.text])
            # "steps": " ".join([elem.text for elem in root.findall("ns:step", namespace) if elem.text])
        }
        
        fileDate = get_file_modified_date(xmlRecipeDir + filename) 
        recipeXML = sitemap_page.format(htmlFilename, thumbnail, fileDate)

                    
        return recipe, recipeXML
    except Exception as e:
        print(f"Error parsing {filename}: {e}")
        return None

     
def main(): 
    searchIndexData = []
    date = get_file_modified_date(indexHtmlFile)

    # initialise the output files
    initOutput(searchIndex, "")
    initOutput(sitemap, sitemap_header.format(date, date))

                        
    directory = os.fsencode(xmlRecipeDir)
    for file in os.listdir(directory):
        filename = os.fsdecode(file) 
        if filename.endswith(".xml"): 
            recipe, recipeXML = parse_recipe(filename)
            
            if recipe:
                searchIndexData.append(recipe)

            if recipeXML:
                with open(sitemap, "a") as f:
                    f.write(recipeXML)
    
    # write the json recipe list to indixe file
    with open(searchIndex, 'a') as f:
        json.dump(searchIndexData, f, indent =4)

    closeOutput(searchIndex, "")
    closeOutput(sitemap, sitemap_footer)
    print("indexing complete")




if __name__== "__main__":
    main()
