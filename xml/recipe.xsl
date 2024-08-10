<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:ns="https://cazzscookingcommunity.github.io"
    exclude-result-prefixes="ns">

    <!-- Output method is HTML -->
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    
    
    <!-- Template to convert XML recipe into HTML -->
    <xsl:template match="/ns:recipe">

    <html lang="en">    
        <head>
            <meta charset="utf-8"></meta>
            <title><xsl:value-of select="ns:title"/></title>
            <link rel="canonical" href="https://cazzscookingcommunity.github.io/recipe.html?recipe={ns:filename}"></link>
          
            <meta name="description" content="Cazz's Cooking Community website let's you browse the Family's favourite recipes"></meta>
            <meta name="author" content="Chris Cullin"></meta>
            <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
            <link href="//fonts.googleapis.com/css?family=Raleway:400,300,600" rel="stylesheet" type="text/css"></link>
            <link rel="stylesheet" href="/css/normalize.css"></link>
            <link rel="stylesheet" href="/css/skeleton.css"></link>
            <link rel="stylesheet" href="/css/app.css"></link>
            <!-- <link rel="icon" type="image/x-icon" href="/favicon.ico"></link> -->
            <!-- <link rel="mask-icon" href="/components/chef.svg" color="#000000"></link> -->
            <!-- <link rel="icon" type="image/png" sizes="any" href="/components/chef_favicon.png"></link> -->
            <link rel="icon" href="/favicon.ico" sizes="32x32"></link>
            <link rel="icon" href="/components/chef.svg" type="image/svg+xml"></link>
            <link rel="apple-touch-icon" href="/components/app_icon_114x114.png"></link><!-- 180×180 -->
            <link rel="manifest" href="/components/manifest.webmanifest"></link>


            <!-- search recipe meta data -->
            <script type="application/ld+json">
                {
                    "@context": "https://schema.org/",
                    "@type": "Recipe",
                    "name": "<xsl:value-of select='ns:title'/>",
                    "author": {
                        "@type": "Person",
                        "name": "Carolyn Cullin"
                    },
                    "image": "/images/<xsl:value-of select='ns:thumbnail'/>",
                    "description": "<xsl:value-of select='ns:title'/>",
                    "prepTime": "<xsl:value-of select='ns:prepTime'/>",
                    "cookTime": "<xsl:value-of select='ns:cookTime'/>",
                    "keywords": "<xsl:value-of select='ns:diet'/>",
                    "recipeYield": "<xsl:value-of select='ns:yield'/>",
                    "recipeCategory": "<xsl:value-of select='ns:category'/>",
                    "recipeIngredient": [
                        <xsl:for-each select="ns:ingredient">
                            <xsl:if test="position() > 1">
                                <xsl:text>, </xsl:text>
                            </xsl:if>
                            <xsl:text>"</xsl:text><xsl:value-of select="."/><xsl:text>"</xsl:text>
                        </xsl:for-each>
            
                        <xsl:for-each select="ns:part">
                            <xsl:if test="position() > 1 or preceding-sibling::ns:ingredient">
                                <xsl:text>, </xsl:text>
                            </xsl:if>
                            <xsl:for-each select="ns:ingredient">
                                <xsl:if test="position() > 1">
                                    <xsl:text>, </xsl:text>
                                </xsl:if>
                                <xsl:text>"</xsl:text><xsl:value-of select="."/><xsl:text>"</xsl:text>
                            </xsl:for-each>
                        </xsl:for-each>
                    ],
            
                    "recipeInstructions": [
                        <xsl:for-each select="ns:step">
                            <xsl:if test="position() > 1">
                                <xsl:text>, </xsl:text>
                            </xsl:if>
                            <xsl:text>{ "@type": "HowToStep", "text": "</xsl:text><xsl:value-of select="."/><xsl:text>" }</xsl:text>
                        </xsl:for-each>
            
                        <xsl:if test="ns:step and ns:part">
                            <xsl:text>, </xsl:text>
                        </xsl:if>
            
                        <xsl:for-each select="ns:part">
                            <xsl:if test="position() > 1 or preceding-sibling::ns:step">
                                <xsl:text>, </xsl:text>
                            </xsl:if>
                            <xsl:text>{ "@type": "HowToSection",
                                        "name": "</xsl:text><xsl:value-of select="ns:title"/><xsl:text>",
                                        "itemListElement": [</xsl:text>
                                            <xsl:for-each select="ns:step">
                                                <xsl:if test="position() > 1">
                                                    <xsl:text>, </xsl:text>
                                                </xsl:if>
                                                <xsl:text>{ "@type": "HowToStep", "text": "</xsl:text><xsl:value-of select="."/><xsl:text>" }</xsl:text>
                                            </xsl:for-each><xsl:text>
                                            ]
                                        }</xsl:text>
                        </xsl:for-each>
                    ]
                }
            </script>        
        </head>

        <body>
        <main role="main" id="main">

            <!-- scroll up -->
            <div class="goTop">
                <a href="#main" tabindex="-1"><img src="/components/icons_up_24.png" title="Back to top" /></a>
            </div> 
            <div class="goBack">
                <img class="goBack" border="0" alt="back" onclick="history.back()" src="/components/icons_back_24.png"/>
            </div>

            <!-- Header with branded title -->
            <header>
                <div class="container">
                    <div class="twelve columns">
                        <a class="heading" tabindex="0" href="/index.html" title="Cazzs Cooking Community">Cazz's Cooking Community</a>
                    </div> 
                </div>
            </header>
            


            <!-- Recipe Section -->
            <section id="random" style="display:block;">
                <div class="container">

                    <!-- heading 1 = recipe name -->
                    <div class="row">
                        <div class="twelve columns">
                            <h1 class="heading brand">
                                    <xsl:value-of select="ns:title"/>
                            </h1>
                            <br/>
                        </div>
                    </div>

                    <!-- meal meta data -->
                    <div class="row mealMetadata">

                        <!-- meal image card -->
                        <div class="four columns mealMetadata" id="randomMealMetadata">
                            <p><span>Category:</span> <xsl:value-of select="ns:category"/></p>
                            <p><span>Serves:</span>   <xsl:value-of select="ns:yield"/></p>
                            <p><span>Prep Time:</span>
                                <xsl:call-template name="convertTime">
                                    <xsl:with-param name="duration" select="ns:prepTime"/>
                                </xsl:call-template>
                            </p>
                            <p>
                                <span>Cook Time:</span>
                                <xsl:call-template name="convertTime">
                                    <xsl:with-param name="duration" select="ns:cookTime"/>
                                </xsl:call-template>
                            </p>
                            <div id="cardActions">
                                <img class="cardAction" border="0" alt="share recipe" onclick="shareRecipe()" src="/components/icons_share.png"/>
                                <img class="cardAction" border="0" alt="print recipe" onclick="printRecipe()" src="/components/icons_print_24.png"/>
                                <img class="cardAction" border="0" alt="edit recipe" onclick="window.open('/recipes/{ns:filename}')" src="/components/icons8-edit-24.png"/>
                            </div>
                        </div> 

                        <div class="six columns" id="mealImgContainer">
                                <img src="/images/{ns:thumbnail}" alt="{ns:title}" class="card u-max-full-width mealCardRecipeBtn"/>
                        </div>


                    </div>

                    <div class="row">
                        <div class="twelve columns ingredients" id="Ingredients">

                            <h2 class="ingredients">Ingredients:</h2>
                            <ul>
                                <xsl:for-each select="ns:ingredient">
                                    <li><xsl:value-of select="."/></li>
                                </xsl:for-each>
                            </ul>
                            <!-- Loop through parts if they exist -->
                            <xsl:for-each select="ns:part">
                                <strong><u><xsl:value-of select="ns:title"/></u></strong>
                                <ul>
                                    <xsl:for-each select="ns:ingredient">
                                        <li><xsl:value-of select="."/></li>
                                    </xsl:for-each>
                                </ul>
                            </xsl:for-each>
                        </div>
                    </div>

                    <!-- preperation steps -->
                    <div class="row">
                        <div class="twelve columns mealInstructions" id="randomMealInstructions">
                            <h2 class="instructions">Instructions:</h2>
                            <ol class="recipe-steps">
                                <xsl:for-each select="ns:step">
                                    <li><xsl:value-of select="."/></li>
                                </xsl:for-each>
                            </ol>
                            <!-- Loop through parts if they exist -->
                            <xsl:for-each select="ns:part">
                                <strong><u><xsl:value-of select="ns:title"/></u></strong>
                                <ol class="recipe-steps">
                                    <xsl:for-each select="ns:step">
                                        <li><xsl:value-of select="."/></li>
                                    </xsl:for-each>
                                </ol>
                            </xsl:for-each>
                        </div>
                    </div>
                </div>
            </section>

            <footer>
                <a href="https://cazzscookingcommunity.github.io" title="Cazz's Cooking Community"> https://cazzscookingcommunity.github.io</a>
                <br/>
                <img alt="guthub status icon" src="https://github.com/cazzscookingcommunity/cazzscookingcommunity.github.io/actions/workflows/build-recipe-index.yml/badge.svg"/>
          
                <div>
                Icons by <a href="https://www.flaticon.com/authors/those-icons" title="Those Icons">Those Icons</a> and <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a>
                from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
                </div>
            </footer>

        </main>
        </body>
    </html>
    </xsl:template> 
    
    
    <!-- Function to convert ISO 8601 duration to a readable format -->
    <xsl:template name="convertTime">
        <xsl:param name="duration"/>
        <xsl:choose>
            <!-- Check if the duration parameter is empty or not provided -->
            <xsl:when test="not($duration) or $duration = ''">
                <xsl:text> </xsl:text>
            </xsl:when>

            <!-- Check if the duration starts with 'PT' -->
            <xsl:when test="starts-with($duration, 'PT')">
                <xsl:variable name="time" select="substring-after($duration, 'PT')"/>
    
                
                <!-- Extract hours, minutes, and seconds from the time string -->
                <xsl:variable name="hours">
                    <xsl:choose>
                        <xsl:when test="contains($time, 'H')">
                            <xsl:value-of select="substring-before($time, 'H')"/>
                        </xsl:when>
                        <xsl:otherwise>0</xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>

                <xsl:variable name="remainingTimeAfterHours">
                    <xsl:choose>
                        <xsl:when test="contains($time, 'H')">
                            <xsl:value-of select="substring-after($time, 'H')"/>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="$time"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>

                <xsl:variable name="minutes">
                    <xsl:choose>
                        <xsl:when test="contains($remainingTimeAfterHours, 'M')">
                            <xsl:value-of select="substring-before($remainingTimeAfterHours, 'M')"/>
                        </xsl:when>
                        <xsl:otherwise>0</xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>

                <xsl:variable name="remainingTimeAfterMinutes">
                    <xsl:choose>
                        <xsl:when test="contains($remainingTimeAfterHours, 'M')">
                            <xsl:value-of select="substring-after($remainingTimeAfterHours, 'M')"/>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="$remainingTimeAfterHours"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>

                <xsl:variable name="seconds">
                    <xsl:choose>
                        <xsl:when test="contains($remainingTimeAfterMinutes, 'S')">
                            <xsl:value-of select="substring-before($remainingTimeAfterMinutes, 'S')"/>
                        </xsl:when>
                        <xsl:otherwise>0</xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>


                <!-- Format output string -->
                <xsl:choose>
                    <!-- When all time parts are empty or zero -->
                    <xsl:when test="$hours = 0 and $minutes = 0 and $seconds = 0">
                        <xsl:text>0 min</xsl:text>
                    </xsl:when>
                    <!-- When only hours are present -->
                    <xsl:when test="$minutes = 0 and $seconds = 0">
                        <xsl:value-of select="concat($hours, ' hrs')"/>
                    </xsl:when>
                    <!-- When only minutes are present -->
                    <xsl:when test="$hours = 0 and $seconds = 0">
                        <xsl:value-of select="concat($minutes, ' min')"/>
                    </xsl:when>
                    <!-- When only seconds are present -->
                    <xsl:when test="$hours = 0 and $minutes = 0">
                        <xsl:value-of select="concat($seconds, ' sec')"/>
                    </xsl:when>
                    <!-- When hours and minutes are present -->
                    <xsl:when test="$seconds = 0">
                        <xsl:value-of select="concat($hours, ' hrs and ', $minutes, ' min')"/>
                    </xsl:when>
                    <!-- When hours and seconds are present -->
                    <xsl:when test="$minutes = 0">
                        <xsl:value-of select="concat($hours, ' hrs  ', $seconds, ' sec')"/>
                    </xsl:when>
                    <!-- When minutes and seconds are present -->
                    <xsl:when test="$hours = 0">
                        <xsl:value-of select="concat($minutes, ' min  ', $seconds, ' sec')"/>
                    </xsl:when>
                    <!-- When all time parts are present -->
                    <xsl:otherwise>
                        <xsl:value-of select="concat($hours, ' hr, ', $minutes, ' min,  ', $seconds, ' sec')"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:when>
            <!-- Handle cases where the format is not recognized -->
            <xsl:otherwise>
                <xsl:text>Unknown duration format</xsl:text>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

       
</xsl:stylesheet>
