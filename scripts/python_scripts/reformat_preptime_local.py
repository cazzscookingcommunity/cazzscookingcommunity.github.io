#!/usr/bin/env python3

""" run locally to update preptime and cooktime format

    updates the format of 1 hour 30 monutes to ISO 8601 PT1H30M
"""

import os
import re
from lxml import etree

def is_iso8601_duration(time_string):
    """Check if a time string is already in ISO 8601 duration format."""
    return bool(re.match(r'^PT(\d+H)?(\d+M)?$', time_string))

def convert_to_iso8601(time_string):
    """Convert time string in 'X hours Y minutes' or 'X minutes' format to ISO 8601 duration format."""
    if is_iso8601_duration(time_string):
        return time_string
    
    match = re.match(r'(?:(\d+)\s*hours?)?\s*(?:(\d+)\s*minutes?)?', time_string, re.IGNORECASE)
    if match:
        hours = int(match.group(1)) if match.group(1) else 0
        minutes = int(match.group(2)) if match.group(2) else 0
        return f"PT{hours}H{minutes}M" if hours else f"PT{minutes}M"
    return 'PT0M'  # Return default if the format doesn't match

def update_time_elements(tree, time_element_name):
    """Update the time elements to ISO 8601 format or add them if they don't exist."""
    root = tree.getroot()
    ns = {'ns': 'https://cazzscookingcommunity.github.io'}
    
    time_element = root.find(f'ns:{time_element_name}', namespaces=ns)
    if time_element is not None:
        if time_element.text is None or not time_element.text.strip():  # Check for None or empty text
            time_element.text = 'PT0M'
        else:
            time_element.text = convert_to_iso8601(time_element.text)
    # else:
    #     new_element = etree.Element(f'{{https://cazzscookingcommunity.github.io}}{time_element_name}')
    #     new_element.text = 'PT0M'
    #     root.append(new_element)

def update_xml_file(file_path):
    """Update prepTime and cookTime elements in the XML file."""
    try:
        # Parse the XML file
        parser = etree.XMLParser(remove_blank_text=True)
        tree = etree.parse(file_path, parser)
        
        # Update prepTime and cookTime elements
        update_time_elements(tree, 'prepTime')
        update_time_elements(tree, 'cookTime')
        
        # Write the updated XML back to file
        with open(file_path, 'wb') as f:
            f.write(etree.tostring(tree, encoding='utf-8', xml_declaration=True))
        
        print(f"Updated: {file_path}")
    except Exception as e:
        print(f"Error updating {file_path}: {e}")

def update_xml_files_in_directory(directory_path):
    """Crawl a directory of XML files and update them."""
    for subdir, _, files in os.walk(directory_path):
        for file in files:
            if file.lower().endswith('.xml'):
                file_path = os.path.join(subdir, file)
                update_xml_file(file_path)


def main():
    # Example usage
    directory_path = 'recipes/'
    # update_xml_files_in_directory(directory_path)
    
    test_file = 'recipes/oven_risotto_with_sweet_spud.xml'
    # test_file = 'recipes/white_sauce.xml'
    update_xml_file(test_file)

if __name__ == "__main__":
    main()



