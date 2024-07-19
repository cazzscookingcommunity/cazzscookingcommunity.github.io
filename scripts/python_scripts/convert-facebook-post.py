#!/bin/python3

""" this script is not an active component

This script was used to convert the facebook cazzscookingcommnity recipes
to xml format suitable for the website
""" 

import os
import sys
import csv
import argparse

# string to look for in facebook export file
facebook = './fb_files/'
recipeStart = '''"Cazz's Cooking Community",,"'''


# strings to insert
filepath = './fb_recipes/'

xmlheader = '''<?xml version="1.0" encoding="UTF-8"?>

<recipe 
xmlns="https://cazzscookingcommunity.github.io" 
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xsi:schemaLocation="https://cazzscookingcommunity.github.io ../xml/recipe.xsd"> 
                                                                                
'''

xmlbody = '''
    <comment></comment>
    <thumbnail>../images/placeholder.png</thumbnail>
    <image></image>
    <category></category>
    <yield></yield>
    <prepTime></prepTime>
    <cookTime></cookTime>
    <part></part>

'''

xmlfooter = '''
    </step>
</recipe>'''

# command line
# parser = argparse.ArgumentParser(description="facebook CSV file convert to XML")
# parser.add_argument("-f", "--file", default=None, required=True, type=str, help="This is the facebook export file")
# args = parser.parse_args()

# inputfile = args.file
# print(f"input filename: {inputfile}")

def loadfile(filename):
    ifile = open(filename, "rt")
    istr = ifile.read()
    ifile.close()
    # print(istr)
    return istr


def splitString(str):
    x = str.split(recipeStart)
    x.pop(0)
    return x

def getTitle(recipe):
    return

def saveFile(recipe, title):
    filename = filepath + title + '.xml'
    if filename != filepath :
        with open(filename, "w") as file:
            file.write(recipe)
            file.close()


def saveRecipe(recipe):

    #  remove facebook text at end of file
    endoffile = recipe.find('"')
    recipe = recipe[:endoffile]

    # format the title into suitable filename
    firstline = recipe.find('\n')
    title = recipe[:firstline].lower()
    oldtitle = title
    title = title.replace(' ', '_')
    title = title.replace('.', '_')
    title = title.replace('!', '_')
    title = title.replace('-', '_')
    title = title.replace('&', '_')
    title = title.replace('*', '_')
    title = title.replace("'", '')
    title = title.replace("`", '')
    title = title.replace('/', '')
    title = title.replace('___', '_')
    title = title.replace('__', '_')
    title = title.rstrip('_')

    # add xml tags in body
    index2 = 0
    recipeArr = recipe.split('\n')
    for index in range(len(recipeArr)):
        line = recipeArr[index]
        if index == 0:
            recipeArr[index]='    <title>' + line + '</title>'
            continue
        
        if index == 1 and line != '':
            recipeArr[index]='    <diet>' + line + '</diet>'
            continue
        
        if line != '':
            index2 = index
            while index2 < len(recipeArr):
                line2 = recipeArr[index2]
                if line2 != '':
                    recipeArr[index2]='    <ingredient>' + line2 + '</ingredient>'
                    index2 += 1
                else:
                    break
            break
    recipeArr.insert(index2 + 1, '    <step>')

    # insert other template xml tags
    xmlbodyTags = xmlbody.split('\n')
    i = 1
    for line in xmlbodyTags:
        recipeArr.insert(i, line)
        i += 1
    
    # add xml header and footer
    recipe = xmlheader + '\n'.join(recipeArr) + xmlfooter
    print("======= AFTER ========")
    print(recipe)

    saveFile(recipe, title)


if __name__== "__main__":
    directory = os.fsencode(facebook)
    
    for file in os.listdir(directory):
        filename = os.fsdecode(file)
        if filename.endswith(".csv"): 
            print(filename)
            filestr = loadfile(facebook + filename)
            filearray = splitString(filestr)
            for recipe in filearray:
                saveRecipe(recipe)
            continue
        else:
            continue




