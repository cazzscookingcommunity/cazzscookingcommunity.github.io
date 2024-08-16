import os
import json
from lxml import etree
import re

# Define the path to the directory containing XML files and the template file
xml_directory = 'recipes/xml/'
template_file = 'recipe-template.html'
output_directory = 'recipes/html/'
# Define the namespace
ns = {'ns': 'https://cazzscookingcommunity.github.io'}



# Read the external HTML template
with open(template_file, 'r') as file:
    template = file.read()


# Utility function to format time, with error handling for blank or missing fields
def format_time(duration):
    if not duration:
        return ""
    try:       
        # Regular expression to match ISO 8601 duration format
        pattern = re.compile(r'P(T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)')
        match = pattern.match(duration)
        
        if not match:
            return "unknown format"

        # Extract hours, minutes, and seconds
        hours = int(match.group(2)) if match.group(2) else 0
        minutes = int(match.group(3)) if match.group(3) else 0
        seconds = int(match.group(4)) if match.group(4) else 0

        # Format the time string based on available components
        time_str = ""
        if hours:
            time_str += f"{hours} hrs "
        if minutes:
            time_str += f"{minutes} mins "
        if seconds:
            time_str += f"{seconds} secs"

        return time_str.strip()  # Remove any trailing whitespace
    except (ValueError, IndexError):
        return "unknown format"
    
# Function to parse XML and extract recipe details
def parse_recipe(xml_file):
    try:
        tree = etree.parse(xml_file)
        root = tree.getroot()
        
        title = root.findtext('ns:title', namespaces=ns)
        filename = root.findtext('ns:filename', namespaces=ns)
        htmlFilename = root.findtext('ns:htmlFilename', namespaces=ns)
        thumbnail = root.findtext('ns:thumbnail', namespaces=ns)
        iso_preptime = root.findtext('ns:prepTime', namespaces=ns)
        iso_cooktime = root.findtext('ns:cookTime', namespaces=ns)
        preptime = format_time(iso_preptime)
        cooktime = format_time(iso_cooktime)
        servings = root.findtext('ns:yield', namespaces=ns)
        
        # Collect all occurrences of diet and category into arrays
        diet_elements = root.findall('ns:diet', namespaces=ns)
        category_elements = root.findall('ns:category', namespaces=ns)

        # Extract text if elements are found, otherwise use an empty list
        diet = [d.text for d in diet_elements if d is not None and d.text]
        category = [c.text for c in category_elements if c is not None and c.text]

        # Convert lists to comma-separated strings for HTML representation, if needed
        diet = ", ".join(diet) if diet else ""  # If the list is empty, return an empty string
        category = ", ".join(category) if category else ""

        
        return {
            "title": title,
            "filename": filename,
            "htmlFilename": htmlFilename,
            "thumbnail": thumbnail,
            "iso_preptime": iso_preptime,
            "iso_cooktime": iso_cooktime,
            "preptime": preptime,
            "cooktime": cooktime,
            "servings": servings,
            "diet": diet,
            "category": category,
        }
    except Exception as e:
        print(f"Error parsing file {xml_file}: {e}")
        return None

# Function to handle ingredients and instructions
def parse_ingredients_and_instructions(root):
    ingredients_list = ""
    instructions_list = ""
    schema_ingredients = []
    schema_instructions = []

    for part in root.findall('ns:part', namespaces=ns):
        part_name = part.findtext('ns:title', namespaces=ns)
        ingredients_list += f"<strong>{part_name}:</strong><ul>"
        instructions_list += f"<strong>{part_name}:</strong><ol class='recipe-steps'>"

        for ingredient in part.findall('ns:ingredient', namespaces=ns):
            ingredients_list += f"<li>{ingredient.text}</li>"
            schema_ingredients.append(ingredient.text)
        ingredients_list += "</ul>"

        for step in part.findall('ns:step', namespaces=ns):
            instructions_list += f"<li>{step.text}</li>"
            schema_instructions.append({"@type": "HowToStep", "text": step.text})
        instructions_list += "</ol>"

    if not ingredients_list and not instructions_list:
        ingredients_list = "<ul>"
        instructions_list = "<ol class='recipe-steps'>"
        
        for ingredient in root.findall('ns:ingredient', namespaces=ns):
            ingredients_list += f"<li>{ingredient.text}</li>"
            schema_ingredients.append(ingredient.text)
        ingredients_list += "</ul>"

        for step in root.findall('ns:step', namespaces=ns):
            instructions_list += f"<li>{step.text}</li>"
            schema_instructions.append({"@type": "HowToStep", "text": step.text})
        instructions_list += "</ol>"

    return ingredients_list, instructions_list, schema_ingredients, schema_instructions

# Function to generate HTML content
def generate_html_content(recipe_data, ingredients_list, instructions_list, schema_ingredients, schema_instructions):
    schema_ingredients_json = json.dumps(schema_ingredients)
    schema_instructions_json = json.dumps(schema_instructions)
    
    html_content = template.format(
        title=recipe_data['title'],
        filename=recipe_data['filename'],
        htmlFilename=recipe_data['htmlFilename'],
        thumbnail=recipe_data['thumbnail'],
        iso_preptime=recipe_data['iso_preptime'],
        preptime=recipe_data['preptime'],
        iso_cooktime=recipe_data['iso_cooktime'],
        cooktime=recipe_data['cooktime'],
        servings=recipe_data['servings'],
        diet=", ".join(recipe_data['diet']),
        category=", ".join(recipe_data['category']),
        ingredients=ingredients_list,
        instructions=instructions_list,
        schema_ingredients=schema_ingredients_json,
        schema_instructions=schema_instructions_json
    )
    
    return html_content

# Function to write HTML content to file
def write_html_file(html_content, output_filename):
    with open(output_filename, 'w') as file:
        file.write(html_content)

# Main function to generate HTML from XML
def generate_html_from_xml(xml_file):
    recipe_data = parse_recipe(xml_file)
    if recipe_data is None:
        return
    
    root = etree.parse(xml_file).getroot()
    ingredients_list, instructions_list, schema_ingredients, schema_instructions = parse_ingredients_and_instructions(root)
    
    html_content = generate_html_content(recipe_data, ingredients_list, instructions_list, schema_ingredients, schema_instructions)
    
    output_filename = os.path.join(output_directory, os.path.basename(xml_file).replace('.xml', '.html'))
    write_html_file(html_content, output_filename)

def main():
    for xml_file in os.listdir(xml_directory):
        if xml_file.endswith('.xml'):
            generate_html_from_xml(os.path.join(xml_directory, xml_file))

if __name__ == "__main__":
    main()




#######

# Function to generate HTML for each recipe
def generate_html_from_xml(xml_file):
    # Parse the XML file
    tree = etree.parse(xml_file)
    root = tree.getroot()
    
    # Extract data from XML
    title = root.findtext('ns:title', namespaces=ns)
    # htmlFilename = os.path.basename(xml_file).replace('.xml', '.html')
    htmlFilename = root.findtext('ns:htmlFilename', namespaces=ns)
    filename = root.findtext('ns:filename', namespaces=ns)
    thumbnail = root.findtext('ns:thumbnail', namespaces=ns)
    iso_preptime = root.findtext('ns:prepTime', namespaces=ns)
    iso_cooktime = root.findtext('ns:cookTime', namespaces=ns)
    preptime = format_time(iso_preptime)
    cooktime = format_time(iso_cooktime)
    servings = root.findtext('ns:yield', namespaces=ns)

    # Collect all occurrences of diet and category into arrays
    diet_elements = root.findall('ns:diet', namespaces=ns)
    category_elements = root.findall('ns:category', namespaces=ns)

    # Extract text if elements are found, otherwise use an empty list
    diet = [d.text for d in diet_elements if d is not None and d.text]
    category = [c.text for c in category_elements if c is not None and c.text]

    # Convert lists to comma-separated strings for HTML representation, if needed
    diet = ", ".join(diet) if diet else ""  # If the list is empty, return an empty string
    category = ", ".join(category) if category else ""

    
    # Handling ingredients and instructions
    ingredients_list = ""
    instructions_list = ""
    schema_ingredients = []
    schema_instructions = []

    for part in root.findall('ns:part', namespaces=ns):
        part_name = part.findtext('ns:title', namespaces=ns)
        ingredients_list += f"<strong>{part_name}:</strong><ul>"
        instructions_list += f"<strong>{part_name}:</strong><ol class='recipe-steps'>"

        for ingredient in part.findall('ns:ingredient', namespaces=ns):
            ingredients_list += f"<li>{ingredient.text}</li>"
            schema_ingredients.append(ingredient.text)
        ingredients_list += "</ul>"

        for step in part.findall('ns:step', namespaces=ns):
            instructions_list += f"<li>{step.text}</li>"
            schema_instructions.append({"@type": "HowToStep", "text": step.text})
        instructions_list += "</ol>"

    # Handle simple recipes without parts
    if not ingredients_list and not instructions_list:
        ingredients_list = "<ul>"
        instructions_list = "<ol class='recipe-steps'>"
        
        for ingredient in root.findall('ns:ingredient', namespaces=ns):
            ingredients_list += f"<li>{ingredient.text}</li>"
            schema_ingredients.append(ingredient.text)
        ingredients_list += "</ul>"

        for step in root.findall('ns:step', namespaces=ns):
            instructions_list += f"<li>{step.text}</li>"
            schema_instructions.append({"@type": "HowToStep", "text": step.text})
        instructions_list += "</ol>"

     # Convert schema data to JSON format
    schema_ingredients_json = json.dumps(schema_ingredients)
    schema_instructions_json = json.dumps(schema_instructions)
    
    # Create the HTML content
    html_content = template.format(
        title=title,
        filename=filename,
        htmlFilename=htmlFilename,
        thumbnail=thumbnail,
        iso_preptime = iso_preptime,
        preptime=preptime,
        iso_cooktime=iso_cooktime,
        cooktime=cooktime,
        diet=diet,
        servings=servings,
        category=category,
        ingredients=ingredients_list,
        instructions=instructions_list,
        schema_ingredients=schema_ingredients_json,
        schema_instructions=schema_instructions_json
    )
    
    # Write the HTML file to the output directory
    with open(os.path.join(output_directory, htmlFilename), 'w') as file:
        file.write(html_content)

def main():
    # Crawl the recipe directory and generate HTML files for each XML file
    for xml_file in os.listdir(xml_directory):
        if xml_file.endswith('.xml'):
            generate_html_from_xml(os.path.join(xml_directory, xml_file))

if __name__== "__main__":
    main()
    print("generation of static html files complete")

    # test individual files before do full directory
    # testfile1="recipes/xml/easy_stir_fry.xml"
    # testfile2="recipes/xml/lasagna.xml"

    # generate_html_from_xml(testfile1)
    # print(f"Conversion of {testfile1} is complete")

    # generate_html_from_xml(testfile2)
    # print(f"Conversion of {testfile2} is complete")


