#!/usr/bin/env python3

'''reformats XML recipes to make pretty

crawls the recipe directory and reformats each recipe
'''

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
    oldPart = 'xsi:schemaLocation="https://cazzscookingcommunity.github.io /xml/recipe.xsd">'
    newPart = 'xsi:schemaLocation="https://cazzscookingcommunity.github.io https://cazzscookingcommunity.github.io/xml/recipe.xsd">'
    xml_string = xml_string.replace( oldPart , newPart)
    return xml_string

def pretty_print_xml(file_path):
    """Format XML file to pretty print with indentation and remove namespace prefixes."""
    try:
        # Parse the XML file
        parser = etree.XMLParser(remove_blank_text=True)
        tree = etree.parse(file_path, parser)
        print(f"parsed file ----------")
        print(tree)
        
        # Remove namespace prefixes
        tree = remove_namespace(tree)
        print("---------------")
        print(f"removed namespace prefixes")
        print(tree)
        # Format the recipe tag
        formatted_xml = format_recipe_tag(etree.tostring(tree, encoding='unicode'))
        print("---------------")
        print(f"formatted the recipe tag")
        
        # Re-parse to apply pretty printing
        print(formatted_xml)
        tree = etree.fromstring(formatted_xml.encode('utf-8'))
        print("\n")
        print("--------------")
        print("printing tree")      
        print(tree)
        pretty_xml_str = prettify(tree)
        print("--------------")
        print(pretty_xml_str)

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

def format_test_file(file):
    with open(file, 'r', encoding='utf-8') as f:
        xml_string = f.read()
        f.close()
    
    pretty_xml = pretty_print_xml(file)
    
    if pretty_xml:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(pretty_xml)
        print(f"Formatted: {file}")


def main():
    # Example usage
    # directory_path = 'recipes/'
    # format_xml_files_in_directory(directory_path)

    test_file = 'recipes/gluten_free_orange_cake.xml'
    format_test_file(test_file)

if __name__ == "__main__":
    main()
