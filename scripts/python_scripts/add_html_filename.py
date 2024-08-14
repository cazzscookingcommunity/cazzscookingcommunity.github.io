import os
from lxml import etree

# Define the XML namespace
ns = {"ns": "https://cazzscookingcommunity.github.io"}

def add_html_filename(xml_file):
    try:
        # Parse the XML file
        tree = etree.parse(xml_file)
        root = tree.getroot()

        # Find the <filename> element
        filename_element = root.find('ns:filename', namespaces=ns)
        if filename_element is not None:
            filename = filename_element.text

            # Generate the HTML filename by replacing 'xml' with 'html'
            html_filename = filename.replace('.xml', '.html')

            # Create the <htmlFilename> element and set its text
            html_filename_element = etree.Element("{https://cazzscookingcommunity.github.io}htmlFilename")
            html_filename_element.text = html_filename

            # Insert the <htmlFilename> element after <filename>
            filename_element.addnext(html_filename_element)

            # Write the modified XML back to the file
            tree.write(xml_file, encoding='UTF-8', xml_declaration=True)
            print(f"Updated {xml_file} with htmlFilename: {html_filename}")
        else:
            print(f"No filename element found in {xml_file}")
    except Exception as e:
        print(f"Error processing file {xml_file}: {e}")

def process_directory(directory):
    # Crawl the directory and process each XML file
    for filename in os.listdir(directory):
        if filename.endswith('.xml'):
            xml_file = os.path.join(directory, filename)
            add_html_filename(xml_file)

if __name__ == "__main__":
    # Set the directory containing the XML files
    directory = "recipes/xml/"  # Replace with the path to your directory
    process_directory(directory)

    # testFile1 = 'recipes/xml/lasagna.xml'
    # add_html_filename(testFile1)
    # testFile2 = 'recipes/xml/easy_stir_fry.xml'
    # add_html_filename(testFile2)
    

