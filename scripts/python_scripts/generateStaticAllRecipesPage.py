import os
import json
from bs4 import BeautifulSoup


# inputs
recipeDir = "recipes/html/"
imageDir = "recipes/images/"
template_file = 'all-recipes-template.html'
index_file = 'components/search_index.json'

# outputs
output_file = 'all-recipes.html'



def create_meal_cards(allRecipes):
    meal_cards = ''
    
    for recipe in allRecipes:
        img = recipe.get('thumbnail', "")
        file = recipe.get('htmlFilename', "")
        
        category_tags = ''
        if recipe.get('category'):
            category_tags = ' '.join(
                f'<a href="#mealCardsSection" class="tag" onclick="searchByTag(\'{tag.strip()}\')">#{tag.strip()}</a>'
                for tag in recipe['category'].split()
            )
        
        diet_tags = ''
        if recipe.get('diet'):
            diet_tags = ' '.join(
                f'<a href="#mealCardsSection" class="tag" onclick="searchByTag(\'{tag}\')">#{tag}</a>'
                for tag in recipe['diet'].split()
            )
        
        meal_cards += (
            f'<div class="cards four columns">'
            f'    <div class="card">'
            f'        <a href="{recipeDir}{file}">'
            f'            <img src="{imageDir}{img}" alt="{recipe.get("title", "")} thumbnail" class="u-max-full-width mealCardRecipeBtn" />'
            f'        </a>'
            f'        <div class="card-body recipe-action" display="none">'
            f'            <div class="cardTitle">{recipe.get("title", "")}</div>'
            f'            <div class="cardTags">{category_tags} {diet_tags}</div>'
            f'        </div>'
            f'    </div>'
            f'</div>'
        )
        # print(pretty_format_html(meal_cards))
        # return (meal_cards)

    return meal_cards



def pretty_format_html(html_string):
    soup = BeautifulSoup(html_string, 'html.parser')
    return soup.prettify()


def generate_html_content(meal_cards):

    # open the template file reading
    with open(template_file, 'r') as file:
        template = file.read()

    html_content = template.format(meal_cards=meal_cards)
    pretty_html_content = pretty_format_html(html_content)

    return pretty_html_content
    

def main():

    # Read the recipe index file
    with open(index_file, 'r') as f:
        allRecipes = json.load(f)

    meal_cards = create_meal_cards(allRecipes)
    content = generate_html_content(meal_cards)

    # write the static html file
    with open(output_file, 'w') as file:
        file.write(content)
    
    print("successfully generated Static AllRecipes file")

if __name__ == "__main__":
    main()

