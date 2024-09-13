import os
from lxml import etree



def validate_file(file_path, xsd_path):
    """Validate an XML file against the provided XSD schema using lxml."""
    try:
        # Load the XML Schema
        with open(xsd_path, 'rb') as schema_file:
            schema_root = etree.parse(schema_file)
            schema = etree.XMLSchema(schema_root)

        # Parse the XML file
        parser = etree.XMLParser(schema=schema)
        with open(file_path, 'rb') as xml_file:
            etree.parse(xml_file, parser)
        
        # if passed validation
        print("*")
        # print(f"Validated: {file_path}")
    except (etree.XMLSchemaError, etree.XMLSyntaxError) as e:
        print(f"Validation failed for {file_path}: {e}")

def format_and_validate_xml_files_in_directory(directory_path, xsd_path):
    print("recipe path: ", directory_path)
    print("xsd path: ", xsd_path)
    """Crawl a directory of XML files, format them, and validate against the XSD schema."""
    for subdir, _, files in os.walk(directory_path):
        for file in files:
            if file.endswith('.xml'):
                file_path = os.path.join(subdir, file)
                print("file: ", file_path)
                # Validate the XML file against the XSD
                validate_file(file_path, xsd_path)

def main():
    # Example usage
    directory_path = 'recipes/xml/'  # Replace with the path to your XML files directory
    xsd_path = 'xml/recipe.xsd'            # Replace with the path to your recipe.xsd file
    format_and_validate_xml_files_in_directory(directory_path, xsd_path)

if __name__ == "__main__":
    main()
