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
            <link rel="canonical" href="https://cazzscookingcommunity.github.io/recipe.html?recipe={ns:filename}" />
          
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
                "name": "<xsl:value-of select='ns:title'/>",
                "author": {
                    "@type": "Person",
                    "name": "Carolyn Cullin"
                },
                "image":            "/images/<xsl:value-of select='ns:thumbnail'/>",
                "description":      "<xsl:value-of select='ns:title'/>",
                "prepTime":         "<xsl:value-of select='ns:prepTime'/>",
                "cookTime":         "<xsl:value-of select='ns:cookTime'/>",
                "keywords":         "<xsl:value-of select='ns:diet'/>",
                "recipeYield":      "<xsl:value-of select='ns:yield'/>",
                "recipeCategory":   "<xsl:value-of select='ns:category'/>",
                "recipeIngredient": [
                    <xsl:for-each select="ns:ingredient">
                        <xsl:if test="position() > 1">
                            <xsl:text>,   
                            </xsl:text>
                        </xsl:if>
                        <xsl:text>"</xsl:text><xsl:value-of select="."/><xsl:text>"</xsl:text>
                    </xsl:for-each>

                    <xsl:for-each select="ns:part">
                        <xsl:if test="position() > 1 or preceding-sibling::ns:ingredient">
                            <xsl:text>,
                            </xsl:text>
                        </xsl:if>
                        <!-- <xsl:text>"</xsl:text><xsl:value-of select="ns:title"/><xsl:text>:</xsl:text> -->
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
            <header>
                <nav class="navbar">
                    <div class="container">
                        <div class="row">
                            <div class="eight columns">
                                <a class="heading" tabindex="0" href="/index.html" title="Cazzs Cooking Community">Cazz's Cooking Community</a>
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
                            <h1 class="heading brand">
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
                            <xsl:call-template name="convertTime">
                                <xsl:with-param name="duration" select="ns:prepTime"/>
                            </xsl:call-template>
                            <br/>
                            <span>Cook Time:</span>
                            <xsl:call-template name="convertTime">
                                <xsl:with-param name="duration" select="ns:cookTime"/>
                            </xsl:call-template>
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
                                    A food recipes website for all of Cazz's favourite family recipes.
                                  </p>
                                  
                                  <p>
                                    We are a family of 5. The 3 kids, now young adults, take turns at cooking dinner.  
                                    This webiste is a collection of family and friends favourite recipes collected over the years 
                                    and is recorded to pass on, and to be used by the kids to cook each week.<br/>
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
    </html>
    </xsl:template> 
    
    
    <!-- Function to convert ISO 8601 duration to a readable format -->
    <xsl:template name="convertTime">
        <xsl:param name="duration"/>
        <xsl:choose>
            <!-- Check if the duration parameter is empty or not provided -->
            <xsl:when test="not($duration) or $duration = ''">
                <xsl:text>Not specified</xsl:text>
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

                <!-- <xsl:value-of select="concat($hours, ' hours, ', $minutes, ' minutes, and ', $seconds, ' seconds')"/> -->
                

                <!-- Format output string -->
                <xsl:choose>
                    <!-- When all time parts are empty or zero -->
                    <xsl:when test="$hours = 0 and $minutes = 0 and $seconds = 0">
                        <xsl:text>0 minutes</xsl:text>
                    </xsl:when>
                    <!-- When only hours are present -->
                    <xsl:when test="$minutes = 0 and $seconds = 0">
                        <xsl:value-of select="concat($hours, ' hours')"/>
                    </xsl:when>
                    <!-- When only minutes are present -->
                    <xsl:when test="$hours = 0 and $seconds = 0">
                        <xsl:value-of select="concat($minutes, ' minutes')"/>
                    </xsl:when>
                    <!-- When only seconds are present -->
                    <xsl:when test="$hours = 0 and $minutes = 0">
                        <xsl:value-of select="concat($seconds, ' seconds')"/>
                    </xsl:when>
                    <!-- When hours and minutes are present -->
                    <xsl:when test="$seconds = 0">
                        <xsl:value-of select="concat($hours, ' hours and ', $minutes, ' minutes')"/>
                    </xsl:when>
                    <!-- When hours and seconds are present -->
                    <xsl:when test="$minutes = 0">
                        <xsl:value-of select="concat($hours, ' hours and ', $seconds, ' seconds')"/>
                    </xsl:when>
                    <!-- When minutes and seconds are present -->
                    <xsl:when test="$hours = 0">
                        <xsl:value-of select="concat($minutes, ' minutes and ', $seconds, ' seconds')"/>
                    </xsl:when>
                    <!-- When all time parts are present -->
                    <xsl:otherwise>
                        <xsl:value-of select="concat($hours, ' hours, ', $minutes, ' minutes, and ', $seconds, ' seconds')"/>
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
