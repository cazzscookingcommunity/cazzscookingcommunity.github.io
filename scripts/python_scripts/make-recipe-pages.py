import os
import sys
import json
from lxml import etree
import re
from bs4 import BeautifulSoup

recipeDir = 'recipes/xml/'
template_file = 'components/html/recipe-template.html'
index_file = 'search_index.json'
output_directory = 'recipes/html/'
ns = {'ns': 'https://cazzscookingcommunity.github.io'}

with open(template_file, 'r') as file:
    template = file.read()

def pretty_format_html(html_string):
    soup = BeautifulSoup(html_string, 'html.parser')
    return soup.prettify()

def format_time(duration):
    if not duration:
        return ""
    try:
        pattern = re.compile(r'P(?:(\d+)D)?(T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?')
        match = pattern.match(duration)
        if not match:
            return "unknown format"

        days = int(match.group(1)) if match.group(1) else 0
        hours = int(match.group(3)) if match.group(3) else 0
        minutes = int(match.group(4)) if match.group(4) else 0
        seconds = int(match.group(5)) if match.group(5) else 0

        time_str = ""
        if days:
            time_str += f"{days} days "
        if hours:
            time_str += f"{hours} hrs "
        if minutes:
            time_str += f"{minutes} mins "
        if seconds:
            time_str += f"{seconds} secs"

        return time_str.strip()
    except (ValueError, IndexError):
        return "unknown format"

def parse_recipe(xml_file):
    try:
        tree = etree.parse(xml_file)
        root = tree.getroot()

        title = root.findtext('ns:title', namespaces=ns)
        filename = root.findtext('ns:filename', namespaces=ns)
        htmlFilename = filename.replace(".xml", ".html")
        thumbnail = root.findtext('ns:thumbnail', namespaces=ns)
        iso_preptime = root.findtext('ns:prepTime', namespaces=ns)
        iso_cooktime = root.findtext('ns:cookTime', namespaces=ns)
        preptime = format_time(iso_preptime)
        cooktime = format_time(iso_cooktime)
        servings = root.findtext('ns:yield', namespaces=ns)

        diet_elements = root.findall('ns:diet', namespaces=ns)
        category_elements = root.findall('ns:category', namespaces=ns)

        diet = ", ".join([d.text for d in diet_elements if d.text])
        category = ", ".join([c.text for c in category_elements if c.text])

        return {
            "id": filename,
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

def parse_ingredients_and_instructions(root):
    ingredients_list = ""
    instructions_list = ""
    schema_ingredients = []
    schema_instructions = []

    parts = root.findall('ns:part', namespaces=ns)
    if parts:
        for part in parts:
            part_name = part.findtext('ns:title', namespaces=ns)
            if part_name:
                ingredients_list += f"<strong>{part_name}:</strong><ul>"
                instructions_list += f"<strong>{part_name}:</strong><ol>"

            for ingredient in part.findall('ns:ingredient', namespaces=ns):
                ingredients_list += f"<li>{ingredient.text}</li>"
                schema_ingredients.append(ingredient.text)
            ingredients_list += "</ul>"

            for step in part.findall('ns:step', namespaces=ns):
                instructions_list += f"<li>{step.text}</li>"
                schema_instructions.append({"@type": "HowToStep", "text": step.text})
            instructions_list += "</ol>"
    else:
        # No parts, so handle ingredients and steps directly
        ingredients_list += "<ul>"
        for ingredient in root.findall('ns:ingredient', namespaces=ns):
            ingredients_list += f"<li>{ingredient.text}</li>"
            schema_ingredients.append(ingredient.text)
        ingredients_list += "</ul>"

        instructions_list += "<ol>"
        for step in root.findall('ns:step', namespaces=ns):
            instructions_list += f"<li>{step.text}</li>"
            schema_instructions.append({"@type": "HowToStep", "text": step.text})
        instructions_list += "</ol>"

    return ingredients_list, instructions_list, schema_ingredients, schema_instructions


def generate_html_content(recipe_data, ingredients_list, instructions_list, schema_ingredients, schema_instructions):
    schema_ingredients_json = json.dumps(schema_ingredients)
    schema_instructions_json = json.dumps(schema_instructions)
    
    html_content = template.format(
        recipeId=recipe_data['id'],
        title=recipe_data['title'],
        filename=recipe_data['filename'],
        htmlFilename=recipe_data['htmlFilename'],
        thumbnail=recipe_data['thumbnail'],
        iso_preptime=recipe_data['iso_preptime'],
        preptime=recipe_data['preptime'],
        iso_cooktime=recipe_data['iso_cooktime'],
        cooktime=recipe_data['cooktime'],
        servings=recipe_data['servings'],
        diet=recipe_data['diet'],
        category=recipe_data['category'],
        ingredients=ingredients_list,
        instructions=instructions_list,
        schema_ingredients=schema_ingredients_json,
        schema_instructions=schema_instructions_json
    )
    
    return html_content

def write_html_file(html_content, output_filename):
    with open(output_filename, 'w') as file:
        file.write(html_content)

def generate_html_from_xml(xml_file):
    recipe_data = parse_recipe(xml_file)
    if recipe_data is None:
        return
    
    root = etree.parse(xml_file).getroot()
    ingredients_list, instructions_list, schema_ingredients, schema_instructions = parse_ingredients_and_instructions(root)
    
    html_content = generate_html_content(recipe_data, ingredients_list, instructions_list, schema_ingredients, schema_instructions)
    
    output_filename = os.path.join(output_directory, os.path.basename(xml_file).replace('.xml', '.html'))
    write_html_file(html_content, output_filename)

def process_directory():
    for xml_file in os.listdir(recipeDir):
        if xml_file.endswith('.xml'):
            generate_html_from_xml(os.path.join(recipeDir, xml_file))

def process_git_changes(changed_files):
    # Process only the changed files passed as an argument
    for file_path in changed_files:
        if os.path.isfile(file_path) and file_path.startswith(recipeDir) and file_path.endswith('.xml'):
            generate_html_from_xml(file_path)
        else:
            print(f"Skipping invalid file: {file_path}")

def validate_files(file_list):
    # Check if file_list contains valid XML files
    for file in file_list:
        if not os.path.isfile(file) or not file.endswith('.xml'):
            print(f"Invalid file: {file}")
            return False
    return True

def main():
    if len(sys.argv) > 1 and sys.argv[1] == 'all':
        # Process all files if 'all' is passed as an argument
        print("Processing all recipes")
        process_directory()
    else:
        # Process specific changed files
        changed_files = sys.argv[1:]
        if changed_files:
            if validate_files(changed_files):
                print(f"Processing changed files: {changed_files}")
                process_git_changes(changed_files)
            else:
                print("Error: One or more files provided are invalid.")
                exit(0)
        else:
            print("No files provided to process. pls run with 'all' or a list of files")

if __name__ == "__main__":
    main()
    print("Generation of static HTML files complete")
