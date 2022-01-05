#!/bin/python3

import os
import sys

# source info
recipedir = "./recipes/"
match_string = "<title>"

def updatefile(filename):          
    with open(recipedir + filename, 'r+') as fd:
        contents = fd.readlines()
        for index, line in enumerate(contents):
            if match_string in line:
                contents.insert(index + 1, '    <filename>' + filename + '</filename>\n')
                break
        fd.seek(0)
        fd.writelines(contents)
        fd.close


if __name__== "__main__":

    directory = os.fsencode(recipedir)
    
    for file in os.listdir(directory):
        filename = os.fsdecode(file)
        if filename.endswith(".xml"):
            print(filename)
            updatefile(filename)
