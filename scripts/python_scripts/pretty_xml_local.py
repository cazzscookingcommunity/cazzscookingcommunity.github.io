#!/usr/bin/env python3

'''Reformats XML recipes to make pretty

Crawls the recipe directory and reformats each recipe
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
    """Format the recipe tag to split the schemaLocation attribute over multiple lines."""
    # Find the start and end of the <recipe> tag
    start_index = xml_string.find('<recipe')
    end_index = xml_string.find('>', start_index)
    
    # Define the new recipe tag with newlines
    new_recipe_tag = (
        '<recipe xmlns="https://cazzscookingcommunity.github.io"\n'
        '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'
        '        xsi:schemaLocation="https://cazzscookingcommunity.github.io /xml/recipe.xsd">'
    )

    # Replace the old recipe tag with the new one
    xml_string = xml_string[:start_index] + new_recipe_tag + xml_string[end_index + 1:]

    return xml_string

def remove_stylesheet(xml_string):
    """Remove the stylesheet that was inserted at the wrong spot"""
    stylesheet = "<?xml-stylesheet type='text/xsl' href='/xml/xsd2html2xml/xsd2html2xml.xsl'?>"
    if stylesheet in xml_string:
        xml_string = xml_string.replace(stylesheet, ' ')
    return xml_string


def insert_stylesheet(xml_string):
    """Insert the XML stylesheet declaration."""
    xmlDeclaration = "<?xml version='1.0' encoding='UTF-8'?>"
    stylesheet = "<?xml-stylesheet type='text/xsl' href='/xml/xsd2html2xml/xsd2html2xml.xsl'?>"
    
    xml_string = xml_string.replace(xmlDeclaration, xmlDeclaration + "\n" + stylesheet)
    return xml_string


def update_thumbnail(xml_string):
    """Update the thumbnail tag content to replace paths with filenames."""
    image_path = "../images/"
    
    xml_string = xml_string.replace(image_path, '')
    return xml_string

def check_filename(tree, file_path):
    # Extract the filename from the file path
    actual_filename = os.path.basename(file_path)
    
    # Find the <filename> tag content (without namespace)
    filename_element = tree.find('.//filename')
    
    if filename_element is not None:
        xml_filename = filename_element.text.strip()   
        # Compare the XML filename with the actual filename (ignoring the file extension)
        if not actual_filename.startswith(xml_filename):
            print(f"Filename mismatch in {file_path}: {xml_filename} != {actual_filename}")
    else:
        print(f"<filename> tag not found in {file_path}")


def pretty_print_xml(file_path):
    """Format XML file to pretty print with indentation and remove namespace prefixes."""
    try:
        # Read the XML file as text
        with open(file_path, 'r', encoding='utf-8') as f:
            xml_string = f.read()

        # Remove Stylesheet that was inserted in the wrong place
        xml_string = remove_stylesheet(xml_string)

        # Check and update the image tag
        xml_string = update_thumbnail(xml_string)

        # Parse the XML string
        parser = etree.XMLParser(remove_blank_text=True)
        tree = etree.fromstring(xml_string.encode('utf-8'), parser)
        
        # Remove namespace prefixes
        tree = remove_namespace(tree)

        # Check filename field for match on actual filename
        check_filename(tree, file_path)

        # Pretty print the XML
        pretty_xml_str = prettify(tree)

        # Format the recipe tag
        pretty_xml_str = format_recipe_tag(pretty_xml_str)

        # Reinsert the stylesheet
        pretty_xml_str = insert_stylesheet(pretty_xml_str)

        return pretty_xml_str
    except Exception as e:
        print(f"Error formatting XML in file {file_path}: {e}")
        return None

def format_file(file):
    pretty_xml = pretty_print_xml(file)
    
    if pretty_xml:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(pretty_xml)
        print(f"Formatted: {file}")
    else:
        print(f"Failed to format: {file}")

def format_xml_files_in_directory(directory_path):
    """Crawl a directory of XML files and format them to pretty print."""
    for subdir, _, files in os.walk(directory_path):
        for file in files:
            if file.lower().endswith('.xml'):
                file_path = os.path.join(subdir, file)
                format_file(file_path)

def main():
    # Example usage
    directory_path = 'recipes/xml/'
    format_xml_files_in_directory(directory_path)

    # testFile1 = 'recipes/xml/lasagna.xml'
    # format_file(testFile1)
    # testFile2 = 'recipes/xml/easy_stir_fry.xml'
    # format_file(testFile2)


if __name__ == "__main__":
    main()
