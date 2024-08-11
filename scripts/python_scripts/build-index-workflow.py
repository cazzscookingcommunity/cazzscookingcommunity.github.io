#!/bin/python3

""" Updates index, sitemap and recipe lists

When a new recipe has been added or a recipe updated VIA WEBSITE
this script is run BY GITHUB WORKFLOW to generate
new sitemap.xml and recipeList.xml files.
"""

import os
import json
import xmlschema
from lxml import etree
import datetime

date = datetime.datetime.now().date()

# input files
recipedir = "recipes/"
index = "index.html"


# output files
searchIndex = "components/search_index.json"
sitemap = "sitemap.xml"
# outputpath = "./xml/"
# outputfile = "recipeList.xml"

# XML output template.  Blank lines are part of the template.
schema = xmlschema.XMLSchema('./xml/recipe.xsd')
# xmlheader = '''<?xml version="1.0" encoding="UTF-8"?>

# <recipeList
# xmlns="https://cazzscookingcommunity.github.io"
# xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
# xsi:schemaLocation="https://cazzscookingcommunity.github.io ../xml/recipeList.xsd">

# '''

# xmlfooter = '''

# </recipeList>
# '''

sitemap_header = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

    <url>
        <loc>https://cazzscookingcommunity.github.io/index.html</loc>
        <lastmod>{}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>'''



sitemap_page = '''
    <url>
        <loc>https://cazzscookingcommunity.github.io/recipe.html?recipe={}</loc>
        <image:image>
            <image:loc>https://cazzscookingcommunity.github.io/images/{}</image:loc>
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

def extract_image_name(file_path):
    try:
        tree = etree.parse(file_path)
        root = tree.getroot()
        namespace = {'ns': 'https://cazzscookingcommunity.github.io'}
        # Find the <thumbnail> tag with namespace handling
        image = root.find('.//ns:thumbnail', namespaces=namespace).text
        return image
    except:
        print("\n*********1")
        print("ERROR getting image: " + filename + " Skipping\n")
        return


def parse_recipe(filename):
    """Parse an XML recipe file and extract relevant fields."""
    try:
        # Parse the XML file
        tree = etree.parse(recipedir + filename)
        root = tree.getroot()

        # Define the namespace
        namespace = {"ns": "https://cazzscookingcommunity.github.io"}

        # Extract fields from the XML
        recipe = {
            "id": os.path.basename(recipedir + filename),
            "title": root.find("ns:title", namespace).text if root.find("ns:title", namespace) is not None else "",
            "filename": root.find("ns:filename", namespace).text if root.find("ns:filename", namespace) is not None else "",
            "thumbnail": root.find("ns:thumbnail", namespace).text if root.find("ns:thumbnail", namespace) is not None else "",
            "category": " ".join([elem.text for elem in root.findall("ns:category", namespace) if elem.text]),
            "diet": " ".join([elem.text for elem in root.findall("ns:diet", namespace) if elem.text]),
            "ingredients": " ".join([elem.text for elem in root.findall("ns:ingredient", namespace) if elem.text])
            # "steps": " ".join([elem.text for elem in root.findall("ns:step", namespace) if elem.text])
        }
        
        imagename = extract_image_name(recipedir + filename)
        fileDate = get_file_modified_date(recipedir + filename)   
        recipeXML = sitemap_page.format(filename, imagename, fileDate)

                    
        return recipe, recipeXML
    except Exception as e:
        print(f"Error parsing {filename}: {e}")
        return None


# def processFile(inputfile, searchIndex, sitemap):
#     try:
#         validRecipe = schema.is_valid(recipedir + filename)
#     except:
#         print("\n*********1")
#         print("ERROR: " + filename + " is not a valid recipe.  Skipping\n")
#         # exit(1)
#         return

#     if schema.is_valid(recipedir + filename):
#         with open(searchIndex, "a") as dst:
#             with open(sitemap, "a") as sm:
#                 with open(recipedir + inputfile, "rt") as src:
#                     sm.write(sitemap_page.format(filename, imagename, fileDate))
#                     dst.write("<recipe>\n")
#                     firstTitle = True
#                     while True:
#                         line = src.readline()
#                         if not line:
#                             break

#                         if firstTitle and "<title>" in line:
#                             dst.write(line)
#                             dst.write("    <filename>" + inputfile + "</filename>\n")
#                             firstTitle = False
#                             continue

#                         if ("<category>"  in line or
#                             "<diet>"      in line or
#                             "<thumbnail>" in line or
#                             "<image>"     in line): 
#                                 dst.write(line)

#                     dst.write("</recipe>\n")
#                     dst.close()
#                     sm.close()
#                     src.close()
#     else:
#         print("\n*********2")
#         print("ERROR: " + filename + " is not a valid recipe.  Skipping\n")
#         return

        
def main(): 
    searchIndexData = []

    initOutput(searchIndex, "")
    initOutput(sitemap, sitemap_header.format(get_file_modified_date(index)))

                        
    directory = os.fsencode(recipedir)
    
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
