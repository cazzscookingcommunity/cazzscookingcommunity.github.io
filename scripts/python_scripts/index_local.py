#!/bin/python3

""" Updates index, sitemap and recipe lists

When a new recipe has been added or a recipe updated
this script is run locally before git commit to generate
new sitemap.xml and recipeList.xml files.
python3 scripts/python_scripts/index-local.py
"""

import os
import sys
import datetime
date = datetime.datetime.now().date()



# source info
recipedir = "./recipes/"

# output info
xmlheader = '''<?xml version="1.0" encoding="UTF-8"?>

<recipeList
xmlns="https://cazzscookingcommunity.github.io"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="https://cazzscookingcommunity.github.io ../xml/recipeList.xsd">

'''

xmlfooter = '''

</recipeList>
'''

sitemap_header = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
'''

sitemap_page = '''
    <url>
        <loc>https://cazzscookingcommunity.github.io/recipe.html?recipe={}</loc>
        <lastmod>{}</lastmod>
        <changefreq>monthly</changefreq>
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


def processFile(filename, recipelist, sitemap):
    with open(recipelist, "a") as dst:
        with open(sitemap, "a") as sm:
            with open(recipedir + filename, "rt") as src:
                # add recipe page to sitemap
                sm.write(sitemap_page.format(filename, date))
                # add recipe to the recipelist
                dst.write("<recipe>\n")
                firstTitle = True
                while True:
                    line = src.readline()
                    if not line:
                        break

                    if firstTitle and "<title>" in line:
                        dst.write(line)
                        dst.write("    <filename>" + filename + "</filename>\n")
                        firstTitle = False
                        continue

                    if ("<category>"  in line or
                        "<diet>"      in line or
                        "<thumbnail>" in line or
                        "<image>"     in line): 
                            dst.write(line)

                dst.write("</recipe>\n")
                dst.close()
                sm.close()
                src.close()
            


if __name__== "__main__":
    recipelist = "./xml/recipeList.xml"
    sitemap = "sitemap.xml"

    initOutput(recipelist, xmlheader)
    initOutput(sitemap, sitemap_header)

    directory = os.fsencode(recipedir)
    
    for file in os.listdir(directory):
        # each file is a recipe.  Crawl the directory
        filename = os.fsdecode(file)
        if filename.endswith(".xml"): 
            print(filename)
            # add the recipe to sitemap and recipelist
            processFile(filename, recipelist, sitemap)

    closeOutput(recipelist, xmlfooter)
    closeOutput(sitemap, sitemap_footer)