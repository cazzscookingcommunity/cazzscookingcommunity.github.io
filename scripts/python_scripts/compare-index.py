#!/bin/python3

import os
import sys

# source info
recipedir = "./recipes/"


def loadlist():
    ifile = open('./xml/recipeList.xml', "rt")
    istr = ifile.read()
    ifile.close()
    # print(istr)
    return istr


            


if __name__== "__main__":
    directory = os.fsencode(recipedir)

    filelist = loadlist()
    
    for file in os.listdir(directory):
        filename = os.fsdecode(file)
        if filename.endswith(".xml"):
            if filename not in filelist:
                print(filename)

