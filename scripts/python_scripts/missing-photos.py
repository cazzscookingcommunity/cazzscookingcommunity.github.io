#!/bin/python3

""" NOT ACTIVE COMPONENT

used to identify recipes with missing images
"""

import os
import sys

import xml.etree.ElementTree as ET


# source info
recipedir = "./recipes/"
imagedir= "./images/"


if __name__== "__main__":

    images = os.fsencode(imagedir)
    imagelist = [os.fsdecode(f) for f in os.listdir(images)]

    recipelist = ET.parse('./xml/recipeList.xml')
    recipes = recipelist.getroot()

    recipe_image_list = []
    with open('recipes-missing-images.txt', "w") as dst:
        for recipe in recipes:
            recipename = recipe[1].text
            imagename = recipe[2].text.split('/')[-1]
            recipe_image_list.append(imagename)

            if imagename not in imagelist or imagename == 'placeholder.jpeg':
                dst.write(recipename + ' , ' + imagename + '\n')
                print(f"image {imagename} not found")
        dst.close()

    with open('images-missing-recipes.txt', "w") as dst:
        for image in imagelist:
            if image not in recipe_image_list:
                dst.write(image + '\n')
                print(f"{image} does not have a recipe")
        dst.close()

