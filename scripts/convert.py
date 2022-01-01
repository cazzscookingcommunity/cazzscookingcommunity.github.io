#!/bin/python3

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
    <title></title>
    <comment></comment>
    <thumbnail></thumbnail>
    <image></image>
    <diet></diet>
    <category></category>
    <yield></yield>
    <prepTime></prepTime>
    <cookTime></cookTime>
    <part></part>
    <ingredient name="" amount="" unit=""></ingredient>
    <step></step>
'''

xmlfooter = '''
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
    endoffile = recipe.find('"')
    recipe = recipe[:endoffile]
    firstline = recipe.find('\n')
    title = recipe[:firstline].lower()
    oldtitle = title
    title = title.replace(' ', '_')
    title = title.replace('.', '_')
    title = title.replace('-', '_')
    title = title.replace('&', '_')
    title = title.replace('*', '_')
    title = title.replace("'", '')
    title = title.replace('/', '')
    title = title.replace('___', '_')
    title = title.replace('__', '_')
    print(str(len(recipe)) + '\t\t' + title + '\t\t' + oldtitle)
    
    
    recipe = xmlheader + xmlbody + recipe + xmlfooter

    saveFile(recipe, title)


if __name__== "__main__":
    directory = os.fsencode(facebook)
    
    for file in os.listdir(directory):
        filename = os.fsdecode(file)
        if filename.endswith(".csv"): 
            filestr = loadfile(facebook + filename)
            filearray = splitString(filestr)
            for recipe in filearray:
                saveRecipe(recipe)
            continue
        else:
            continue




