#!/usr/bin/env python3

""" reformats XML recipes to make pretty

crawls the recipe directory and reformats each recipe
"""

import os
from lxml import etree

def prettify(element):
    """Return a pretty-printed XML string for the Element."""
    rough_string = etree.tostring(element, pretty_print=True, encoding='UTF-8', xml_declaration=True)
    return rough_string.decode('utf-8')

def remove_namespace(tree):
    """Remove namespace prefixes from the parsed XML."""
    for elem in tree.getiterator():
        if not hasattr(elem.tag, 'find'): continue
        i = elem.tag.find('}')
        if i >= 0:
            elem.tag = elem.tag[i+1:]
    return tree

def format_recipe_tag(xml_string):
    """Split the <recipe> opening tag's xmlns and xsi attributes onto separate lines."""
    xml_string = xml_string.replace(
        '<recipe xmlns="https://cazzscookingcommunity.github.io" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="https://cazzscookingcommunity.github.io /xml/recipe.xsd">',
        '<recipe\n    xmlns="https://cazzscookingcommunity.github.io"\n    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n    xsi:schemaLocation="https://cazzscookingcommunity.github.io /xml/recipe.xsd">'
    )
    return xml_string

def pretty_print_xml(file_path):
    """Format XML file to pretty print with indentation and remove namespace prefixes."""
    try:
        # Parse the XML file
        parser = etree.XMLParser(remove_blank_text=True)
        tree = etree.parse(file_path, parser)
        
        # Remove namespace prefixes
        tree = remove_namespace(tree)
        
        # Format the recipe tag
        formatted_xml = format_recipe_tag(etree.tostring(tree, encoding='unicode'))
        
        # Re-parse to apply pretty printing
        tree = etree.fromstring(formatted_xml.encode('utf-8'))
        pretty_xml_str = prettify(tree)

        return pretty_xml_str
    except Exception as e:
        print(f"Error formatting XML: {e}")
        return None

def format_xml_files_in_directory(directory_path):
    """Crawl a directory of XML files and format them to pretty print."""
    for subdir, _, files in os.walk(directory_path):
        for file in files:
            if file.lower().endswith('.xml'):
                file_path = os.path.join(subdir, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    xml_string = f.read()
                
                pretty_xml = pretty_print_xml(file_path)
                
                if pretty_xml:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(pretty_xml)
                    print(f"Formatted: {file_path}")

def main():
    # Example usage
    directory_path = 'recipes/'
    format_xml_files_in_directory(directory_path)

if __name__ == "__main__":
    main()
