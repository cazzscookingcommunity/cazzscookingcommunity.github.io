#!/bin/python3

import os
import sys

# source info
recipedir = "./recipes/"

# output info
outputpath = "./xml/"
outputfile = "recipeList.xml"
xmlheader = '''<?xml version="1.0" encoding="UTF-8"?>

<recipeList
xmlns="https://cazzscookingcommunity.github.io"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="https://cazzscookingcommunity.github.io ../xml/recipeList.xsd">

'''

xmlfooter = '''

</recipeList>
'''

def loadfile(filename):
    ifile = open(filename, "rt")
    istr = ifile.read()
    ifile.close()
    # print(istr)
    return istr

def initOutput(file):
    with open(file, "w") as dst:
        dst.write(xmlheader)
        dst.close()

def closeOutput(file):
    with open(file, "a") as dst:
        dst.write(xmlfooter)
        dst.close()


def processFile(inputfile):
    with open(outputpath + outputfile, "a") as dst:
        with open(recipedir + inputfile, "rt") as src:
            dst.write("<recipe>\n")
            firstTitle = True
            while True:
                line = src.readline()
                if not line:
                    break

                if firstTitle and "<title>" in line:
                    dst.write(line)
                    dst.write("    <filename>" + inputfile + "</filename>\n")
                    firstTitle = False
                    continue

                if ("<category>"  in line or
                    "<diet>"      in line or
                    "<thumbnail>" in line or
                    "<image>"     in line): 
                        dst.write(line)

            dst.write("</recipe>\n")
            dst.close()
            src.close()
            


if __name__== "__main__":
    initOutput(outputpath + outputfile)
    directory = os.fsencode(recipedir)
    
    for file in os.listdir(directory):
        filename = os.fsdecode(file)
        if filename.endswith(".xml") and filename != outputfile: 
            print(filename)
            processFile(filename)

    closeOutput(outputpath + outputfile)