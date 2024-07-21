<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:ns="https://cazzscookingcommunity.github.io"
    exclude-result-prefixes="ns">

    <!-- Output method is HTML -->
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>

    <!-- Template to match the root element and transform it into the HTML structure -->
    <xsl:template match="/ns:recipe">
            <div class="container">
                <div class="row">
                    <div class="twelve columns">
                        <h3 class="heading" id="dynamicTitle">
                            <xsl:value-of select="ns:title"/>
                        </h3>
                        <br/>
                    </div>
                </div>
                <div class="row">
                    <div class="four columns mealImg" id="randomMealImg">
                        <img src="{ns:thumbnail}" alt="Recipe Image"/>
                    </div>
                    <div class="eight columns mealMetadata" id="randomMealMetadata">
                        <span>Name:</span>
                        <xsl:value-of select="ns:title"/>
                        <br/>
                        <span>Category:</span>
                        <xsl:value-of select="ns:category"/>
                        <br/><br/>
                        <span>Ingredients:</span>
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
                        <a href="mailto:?subject=https://cazzscookingcommunity.io/recipe.html?recipe={ns:filename}">
                            <img class="cardAction" border="0" alt="email recipe" src="/components/icons8-mail-24.png"/>
                        </a>
                        <img class="cardAction" border="0" alt="edit recipe" onclick="window.open('/recipes/{ns:filename}')" src="/components/icons8-edit-24.png"/>
                    </div>
                </div>
                <div class="row">
                    <div class="twelve columns mealInstructions" id="randomMealInstructions">
                        <span>Instructions:</span>
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
    </xsl:template>
</xsl:stylesheet>
