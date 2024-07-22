#!/bin/python3

""" Runs locally and updates recipe steps

Scans the recipe directory and seperate steps into multiple steps 
with "." as the seperator.
"""

from lxml import etree
import os

# Define paths
xsd_path = 'xml/recipe.xsd'
recipe_dir = 'recipes/'

# Load XSD schema
xsd_schema = etree.parse(xsd_path)
xmlschema = etree.XMLSchema(xsd_schema)

def process_xml(file_path):
    try:
        # Parse XML file
        xml_doc = etree.parse(file_path)
        
        # Validate XML against XSD
        if not xmlschema.validate(xml_doc):
            print(f"Validation failed for {file_path}")
            return
        
        # Find the root element
        root = xml_doc.getroot()
        
        # Define namespace
        ns = {'ns': 'https://cazzscookingcommunity.github.io'}
        
        # Find and process all 'step' elements
        steps = root.findall('.//ns:step', namespaces=ns)
        for step in steps:
            step_text = step.text.strip()
            if step_text:
                # Split the text by periods and create new steps
                step_texts = [s.strip() for s in step_text.split('.') if s.strip()]
                
                # Remove the original step
                parent = step.getparent()
                parent.remove(step)
                
                # Add new step elements
                for text in step_texts:
                    new_step = etree.Element('{https://cazzscookingcommunity.github.io}step')
                    new_step.text = text + '.'
                    parent.append(new_step)
        
        # Save the updated XML file
        xml_doc.write(file_path, pretty_print=True, xml_declaration=True, encoding='UTF-8')
        # print(f"Updated {file_path}")
        
    except etree.XMLSyntaxError as e:
        print(f"XMLSyntaxError in {file_path}: {e}")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

# Process each XML file in the directory
for filename in os.listdir(recipe_dir):
    if filename.endswith('.xml'):
        file_path = os.path.join(recipe_dir, filename)
        process_xml(file_path)

print("Processing completed.")
