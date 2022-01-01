<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
<html>
<head>
  <meta charset="utf-8"/>
  <title>Cazz's Cooking Community</title>
  <meta name="description" content="Cazz's Cooking Community website let's you browse the Family's favourite recipes"/>
  <meta name="author" content="Chris Cullin"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <link href="//fonts.googleapis.com/css?family=Raleway:400,300,600" rel="stylesheet" type="text/css"/>
  <!-- <link href="https://fonts.googleapis.com/css?family=Roboto+Slab&display=swap" rel="stylesheet"> -->
  <link rel="stylesheet" href="../css/normalize.css"/>
  <link rel="stylesheet" href="../css/skeleton.css"/>
  <link rel="stylesheet" href="../css/app.css"/>
  <link rel="icon" type="image/png" href="../images/favicon.png"/>
</head>

<body>
  <section id="random">
    <br/>
    <div class="container">
      <div class="row">
        <div class="four columns">
          <h3 class="heading" id="dynamicTitle">
            <xsl:value-of select="title"/>
          </h3> <br/>
        </div>

        <div class="eight columns" style="text-align:right;">
          <br/>
          <a id="searchAgainBtn" class="button btnRandomRecipe" href="#landing" title="Searh again" style="margin-right:10px">Search again</a>
          <img src="../images/chef.svg" class="u-max-full-width chefimg" alt="Chef icon" />
          <button id="dynamicButton" class="button btnRandomRecipe" title="Show another random recipe">Randomize</button>
        </div>    
      </div>

      <div class="row">
        <div class="four columns mealImg" id="randomMealImg">
          <div class="loader">TEST
          </div>
        </div>

        <div class="eight columns mealMetadata" id="randomMealMetadata">
          <h4>INGREDIENTS:</h4>
          <ul>
            <xsl:for-each select="/recipe/ingredient">
              <li>
                <xsl:value-of select="@name"/> <xsl:value-of select="@amount"/> <xsl:value-of select="@unit"/>  
              </li>
            </xsl:for-each>
          </ul>

          <xsl:for-each select="/recipe/part">
            <b><xsl:value-of select="title"/></b>
            <ul>
              <xsl:for-each select="ingredient">
                <li>
                  <xsl:value-of select="@name"/> <xsl:value-of select="@amount"/> <xsl:value-of select="@unit"/>  
                </li>
              </xsl:for-each>
            </ul>
          </xsl:for-each>
        </div>
      </div>

      <div class="row">
        <div class="twelve columns mealInstructions" id="randomMealInstructions">
          <h4>INSTRUCTIONS:</h4>
          <ol>
            <xsl:for-each select="/recipe/step">
              <li><xsl:value-of select="."/></li>
            </xsl:for-each>                            
          </ol>

          <br/>
          <xsl:for-each select="/recipe/part">
            <b><xsl:value-of select="title"/></b>
            <ol>
              <xsl:for-each select="step">
                <li><xsl:value-of select="."/></li>
              </xsl:for-each>
            </ol>
          </xsl:for-each>
        </div>
      </div>
    </div>
  </section>
</body>
</html>

</xsl:template>
</xsl:stylesheet>
