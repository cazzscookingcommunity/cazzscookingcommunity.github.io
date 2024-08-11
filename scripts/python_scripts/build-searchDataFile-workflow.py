#!/usr/bin/env python3

"""Scans all recipes and builds a search index for use with JavaScript."""

import os
import json
from lxml import etree

def parse_recipe(file_path):
    """Parse an XML recipe file and extract relevant fields."""
    try:
        # Parse the XML file
        tree = etree.parse(file_path)
        root = tree.getroot()

        # Define the namespace
        namespace = {"ns": "https://cazzscookingcommunity.github.io"}

        # Extract fields from the XML
        recipe = {
            "id": os.path.basename(file_path),
            "title": root.find("ns:title", namespace).text if root.find("ns:title", namespace) is not None else "",
            "filename": root.find("ns:filename", namespace).text if root.find("ns:filename", namespace) is not None else "",
            "thumbnail": root.find("ns:thumbnail", namespace).text if root.find("ns:thumbnail", namespace) is not None else "",
            "category": " ".join([elem.text for elem in root.findall("ns:category", namespace) if elem.text]),
            "diet": " ".join([elem.text for elem in root.findall("ns:diet", namespace) if elem.text]),
            "ingredients": " ".join([elem.text for elem in root.findall("ns:ingredient", namespace) if elem.text])
            # "steps": " ".join([elem.text for elem in root.findall("ns:step", namespace) if elem.text])
        }
        return recipe
    except Exception as e:
        print(f"Error parsing {file_path}: {e}")
        return None

def generate_search_index(directory):
    """Generate a JSON search index for all XML recipes in the given directory."""
    recipes = []

    # Iterate over all XML files in the directory
    for filename in os.listdir(directory):
        if filename.endswith(".xml"):
            file_path = os.path.join(directory, filename)
            recipe = parse_recipe(file_path)
            if recipe:
                recipes.append(recipe)

    # Write the search index to a JSON file
    with open('search_index.json', 'w') as f:
        json.dump(recipes, f, indent=2)

    print("Search index generated successfully!")

def main():
    # Specify the directory containing your XML recipes
    recipes_directory = 'recipes/'
    generate_search_index(recipes_directory)

if __name__ == "__main__":
    main()
