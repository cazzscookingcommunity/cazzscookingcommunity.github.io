import os
import json
from lxml import etree
import re
from bs4 import BeautifulSoup

# Define the path to the directory containing XML files and the template file
recipeDir = 'recipes/xml/'
template_file = 'components/html/recipe-template.html'
index_file = 'search_index.json'
git_changes = 'files.txt' # files.txt created by Github Actions. see .gituhub/workflows/build-recipe-index.yml



output_directory = 'recipes/html/'
# Define the namespace
ns = {'ns': 'https://cazzscookingcommunity.github.io'}



# Read the external HTML template
with open(template_file, 'r') as file:
    template = file.read()


def pretty_format_html(html_string):
    soup = BeautifulSoup(html_string, 'html.parser')
    return soup.prettify()

# Utility function to format time, with error handling for blank or missing fields
def format_time(duration):
    if not duration:
        return ""
    try:
        # Updated regular expression to match ISO 8601 duration format with days
        pattern = re.compile(r'P(?:(\d+)D)?(T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?')
        match = pattern.match(duration)

        if not match:
            return "unknown format"

        # Extract days, hours, minutes, and seconds
        days = int(match.group(1)) if match.group(1) else 0
        hours = int(match.group(3)) if match.group(3) else 0
        minutes = int(match.group(4)) if match.group(4) else 0
        seconds = int(match.group(5)) if match.group(5) else 0

        # Format the time string based on available components
        time_str = ""
        if days:
            time_str += f"{days} days "
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
        # htmlFilename = root.findtext('ns:htmlFilename', namespaces=ns)
        htmlFilename = filename.replace(".xml", ".html")
        thumbnail = root.findtext('ns:thumbnail', namespaces=ns)
        iso_preptime = root.findtext('ns:prepTime', namespaces=ns)
        iso_cooktime = root.findtext('ns:cookTime', namespaces=ns)
        preptime = format_time(iso_preptime)
        cooktime = format_time(iso_cooktime)
        servings = root.findtext('ns:yield', namespaces=ns)
        
        diet_elements = root.findall('ns:diet', namespaces=ns)
        category_elements = root.findall('ns:category', namespaces=ns)

        # Ensure the variables are strings if there's only one category or diet
        diet = [d.text for d in diet_elements if d is not None and d.text]
        category = [c.text for c in category_elements if c is not None and c.text]

        diet = ", ".join(diet) if diet else ""  # Treat as a string
        category = ", ".join(category) if category else ""  # Treat as a string

        
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

# Function to handle ingredients and instructions
def parse_ingredients_and_instructions(root):
    ingredients_list = ""
    instructions_list = ""
    schema_ingredients = []
    schema_instructions = []

    for part in root.findall('ns:part', namespaces=ns):
        part_name = part.findtext('ns:title', namespaces=ns)
        ingredients_list += f"<strong>{part_name}:</strong><ul>"
        instructions_list += f"<strong>{part_name}:</strong><ol'>"

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
        instructions_list = "<ol>"
        
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

def process_directory():
    for xml_file in os.listdir(recipeDir):
        if xml_file.endswith('.xml'):
            generate_html_from_xml(os.path.join(recipeDir, xml_file))
    return

def process_git_changes():
    # get all recipes from index
    with open(index_file, 'r') as f:
        allRecipes = json.load(f)

    with open(git_changes, 'r') as file:
            changed_files = file.readlines()

    # Remove 'recipes/' prefix and process each file
    for file_path in changed_files:
        file_name = file_name.replace(recipeDir, '')
        
        # Search for the recipe in the search_index
        recipe = next((recipe for recipe in allRecipes if recipe['filename'] == file_name), None)
        generate_html_from_xml(file_path)
    return



def main():
    if os.path.exists(git_changes):
        # Running on GitHub actions, so process changed files
        print("processing git changes")
        process_git_changes()
    else:
        # Running locally so process all recipes
        print("processing all recipes")
        process_directory()

        # test individual files before do full directory
        # testfile1="recipes/xml/acquacotta.xml"
        # testfile2="recipes/xml/american_bbq_spareribs.xml"

        # generate_html_from_xml(testfile1)
        # print(f"Conversion of {testfile1} is complete")

        # generate_html_from_xml(testfile2)
        # print(f"Conversion of {testfile2} is complete")



if __name__== "__main__":
    main()
    print("generation of static html files complete")


