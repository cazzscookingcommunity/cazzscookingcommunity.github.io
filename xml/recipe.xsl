<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:ns="https://cazzscookingcommunity.github.io"
    exclude-result-prefixes="ns">

    <!-- Output method is HTML -->
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>

    <!-- Template to match the root element and transform it into the HTML structure -->
    <xsl:template match="/ns:recipe">

    <html lang="en">    
        <head>
            <meta charset="utf-8"></meta>
            <title><xsl:value-of select="ns:title"/></title>
          
            <meta name="description" content="Cazz's Cooking Community website let's you browse the Family's favourite recipes"></meta>
            <meta name="author" content="Chris Cullin"></meta>
            <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
            <link href="//fonts.googleapis.com/css?family=Raleway:400,300,600" rel="stylesheet" type="text/css"></link>
            <!-- <link href="https://fonts.googleapis.com/css?family=Roboto+Slab&display=swap" rel="stylesheet"> -->
            <link rel="stylesheet" href="/css/normalize.css"></link>
            <link rel="stylesheet" href="/css/skeleton.css"></link>
            <link rel="stylesheet" href="/css/app.css"></link>
            <link rel="icon" type="/image/png" href="/components/favicon.png"></link>
        
            <!-- search recipe meta data -->
            <script type="application/ld+json"> {
                "@context": "https://schema.org/",
                "@type": "Recipe",
                "name": '<xsl:value-of select="ns:title"/>',
                "author": {
                    "@type": "Person",
                    "name": "Carolyn Cullin"
                },
                "image":            '/images/<xsl:value-of select="ns:thumbnail"/>',
                "description":      '<xsl:value-of select="ns:title"/>',
                "prepTime":         '<xsl:value-of select="ns:prepTime"/>',
                "cookTime":         '<xsl:value-of select="ns:cookTime"/>',
                "keywords":         '<xsl:value-of select="ns:diet"/>',
                "recipeYield":      '<xsl:value-of select="ns:yield"/>',
                "recipeCategory":   '<xsl:value-of select="ns:category"/>',
                "recipeIngredient": [
                                        <xsl:for-each select="ns:ingredient">
                                            '<xsl:value-of select="."/>',
                                        </xsl:for-each>

                                        <!-- Loop through parts if they exist -->
                                        <xsl:for-each select="ns:part">
                                            '<xsl:value-of select="ns:title"/>:',
                                            <xsl:for-each select="ns:ingredient">
                                                '<xsl:value-of select="."/>',
                                            </xsl:for-each>
                                        </xsl:for-each>,
                                    ]
                "recipeInstructions": [
                                        <xsl:for-each select="ns:step">
                                            '<xsl:value-of select="."/>',
                                        </xsl:for-each>

                                        <!-- Loop through parts if they exist -->
                                        <xsl:for-each select="ns:part">
                                                '<xsl:value-of select="ns:title"/>:',
                                                <xsl:for-each select="ns:step">
                                                    '<xsl:value-of select="."/>',
                                                </xsl:for-each>
                                        </xsl:for-each>
                                    ]
                }
            </script>
        </head>

        <body>
        <main role="main" id="main">
            <header>
                <nav class="navbar">
                    <div class="container">
                        <div class="row">
                            <div class="eight columns">
                                <a class="brand" tabindex="0" href="/index.html" title="Cazzs Cooking Community">Cazz's Cooking Community</a>
                            </div>
                            <div class="four columns">
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            
            <!-- scroll up -->
            <div class="back">
                <a href="#main" tabindex="-1"><img src="/components/scroll.svg" title="Back to top" /></a>
            </div> 

            <section id="random" style="display:block;">
                <div class="container">
                    <!-- heading 1 = recipe name -->
                    <div class="row">
                        <div class="twelve columns">
                            <h1 class="brand">
                                    <xsl:value-of select="ns:title"/>
                            </h1>
                            <br/>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="four columns mealImg" id="randomMealImg">
                            <img src="/images/{ns:thumbnail}" alt="{ns:title}"/>
                        </div>
                        <div class="eight columns mealMetadata" id="randomMealMetadata">
                            <span>Category:</span>
                            <xsl:value-of select="ns:category"/>
                            <br/>
                            <span>Serves:</span>
                            <xsl:value-of select="ns:yield"/>
                            <br/>
                            <span>Prep Time:</span>
                            <xsl:value-of select="ns:prepTime"/>
                            <br/>
                            <span>Cook Time:</span>
                            <xsl:value-of select="ns:cookTime"/>
                            <br/>
                            
                            <br/>
                            <h2 class="ingredients">Ingredients:</h2>
                            <ul>
                                <xsl:for-each select="ns:ingredient">
                                    <li><xsl:value-of select="."/></li>
                                </xsl:for-each>
                                <xsl:if test="count(ns:ingredient) mod 2 != 0">
                                    <li></li>
                                </xsl:if>
                            </ul>
                            <!-- Loop through parts if they exist -->
                            <xsl:for-each select="ns:part">
                                <div>
                                    <strong><u><xsl:value-of select="ns:title"/></u></strong>
                                    <ul>
                                        <xsl:for-each select="ns:ingredient">
                                            <li><xsl:value-of select="."/></li>
                                        </xsl:for-each>
                                        <xsl:if test="count(ns:ingredient) mod 2 != 0">
                                            <li></li>
                                        </xsl:if>
                                    </ul>
                                </div>
                            </xsl:for-each>
                        </div>
                    </div>

                    <div class="row">
                        <div class="four columns mealActions" id="randomMealActions">
                            <a href="mailto:?subject=https://cazzscookingcommunity.github.io/recipe.html?recipe={ns:filename}">
                                <img class="cardAction" border="0" alt="email recipe" src="/components/icons8-mail-24.png"/>
                            </a>
                            <img class="cardAction" border="0" alt="edit recipe" onclick="window.open('/recipes/{ns:filename}')" src="/components/icons8-edit-24.png"/>
                        </div>
                    </div>

                    <div class="row">
                        <div class="twelve columns mealInstructions" id="randomMealInstructions">
                            <h2 class="instructions">Instructions:</h2>
                            <ul>
                                <xsl:for-each select="ns:step">
                                    <p>step <xsl:number format="1"/>:<br/><xsl:value-of select="."/></p>
                                </xsl:for-each>
                            </ul>
                            <!-- Loop through parts if they exist -->
                            <xsl:for-each select="ns:part">
                                <div>
                                    <strong><u><xsl:value-of select="ns:title"/></u></strong>
                                    <ul>
                                        <xsl:for-each select="ns:step">
                                            <p>step <xsl:number format="1"/>:<br/><xsl:value-of select="."/></p>
                                        </xsl:for-each>
                                    </ul>
                                </div>
                            </xsl:for-each>
                        </div>
                    </div>
                </div>
            </section>

            <section id="about-section">
                <div class="container">
                    <div class="row">
                        <div class="twelve columns">
                        <div class="row d-flex">
                            <div class="four columns" style="align-self:center;">
                            <h2 class="heading">About</h2>
                            </div>
                            <div class="eight columns">
                            <p>
                                A food recipes website for all of Cazz's favourite family recipes
                            </p>
                            
                            <p>
                                We are a family of 5. The 3 kids, now young adults, take turns cookng.  
                                This webiste is a collection of family and friends favourites collected over the years 
                                and is recorded to pass, and is used by the kids to cook each week.<br/>
                            </p>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer>
                <div>
                Icons by <a href="https://www.flaticon.com/authors/those-icons" title="Those Icons">Those Icons</a> and <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> <br/>
                from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
                </div>
                <div>
                <a href="https://cazzscookingcommunity.github.io/sitemap.xml" title="sitemap">sitemap</a>
                </div>
                <div>
                <a href="/components/admin.html">recipe admin</a>
                </div>
            </footer>

        </main>
        </body>
        <!-- <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script> -->
        <!-- <script src="/scripts/main.js"></script> -->
        <!-- <script src="/scripts/recipe.js"></script> -->
    </html>

    </xsl:template>
</xsl:stylesheet>
