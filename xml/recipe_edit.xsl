<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:html="http://www.w3.org/1999/xhtml"
    xmlns:my="https://cazzscookingcommunity.github.io">
    
    <!-- Template to match the root element -->
    <xsl:template match="/recipe">
        <html:html>
            <html:body>
                <form action="javascript:void(0);" class="xsd2html2xml" onsubmit="upload_recipe(htmlToXML(this));">
                    <section>
                        <!-- Title -->
                        <fieldset data-xsd2html2xml-namespace="https://cazzscookingcommunity.github.io"
                                  data-xsd2html2xml-type="element"
                                  data-xsd2html2xml-name="recipe"
                                  data-xsd2html2xml-xpath="/recipe">
                            <legend>recipe</legend>
                            <section>
                                <label data-xsd2html2xml-namespace="https://cazzscookingcommunity.github.io"
                                       data-xsd2html2xml-type="element"
                                       data-xsd2html2xml-name="title"
                                       data-xsd2html2xml-xpath="/recipe/title">
                                    <input type="text"
                                           onchange="if (this.value) { this.setAttribute('value', this.value.replace(/\s+/g, ' ').trim()); } else { this.removeAttribute('value'); };"
                                           required="required"
                                           pattern=".{0,}"
                                           data-xsd2html2xml-primitive="token"
                                           data-xsd2html2xml-description="title"
                                           data-xsd2html2xml-filled="true"
                                           value="{title}">
                                    <span>title</span>
                                </label>
                            </section>

                            <!-- Filename -->
                            <section>
                                <label data-xsd2html2xml-namespace="https://cazzscookingcommunity.github.io"
                                       data-xsd2html2xml-type="element"
                                       data-xsd2html2xml-name="filename"
                                       data-xsd2html2xml-xpath="/recipe/filename">
                                    <input type="text"
                                           onchange="if (this.value) { this.setAttribute('value', this.value.replace(/\s+/g, ' ').trim()); } else { this.removeAttribute('value'); };"
                                           required="required"
                                           pattern=".{0,}"
                                           data-xsd2html2xml-primitive="token"
                                           data-xsd2html2xml-description="filename"
                                           data-xsd2html2xml-filled="true"
                                           value="{filename}">
                                    <span>filename</span>
                                </label>
                            </section>

                            <!-- Comment -->
                            <section>
                                <label data-xsd2html2xml-namespace="https://cazzscookingcommunity.github.io"
                                       data-xsd2html2xml-type="element"
                                       data-xsd2html2xml-name="comment"
                                       data-xsd2html2xml-xpath="/recipe/comment" hidden="">
                                    <input type="text"
                                           onchange="if (this.value) { this.setAttribute('value', this.value); } else { this.removeAttribute('value'); };"
                                           required="required"
                                           pattern=".{0,}"
                                           data-xsd2html2xml-primitive="string"
                                           data-xsd2html2xml-description="comment"
                                           disabled="">
                                    <span>comment<button type="button" class="remove" onclick="clickRemoveButton(this);"></button></span>
                                </label>
                                <button type="button" class="add" data-xsd2html2xml-min="0" data-xsd2html2xml-max="1" onclick="clickAddButton(this);">comment</button>
                            </section>

                            <!-- Thumbnail -->
                            <section>
                                <label data-xsd2html2xml-namespace="https://cazzscookingcommunity.github.io"
                                       data-xsd2html2xml-type="element"
                                       data-xsd2html2xml-name="thumbnail"
                                       data-xsd2html2xml-xpath="/recipe/thumbnail">
                                    <input type="text"
                                           onchange="if (this.value) { this.setAttribute('value', this.value); } else { this.removeAttribute('value'); };"
                                           required="required"
                                           pattern=".{0,}"
                                           data-xsd2html2xml-primitive="string"
                                           data-xsd2html2xml-description="thumbnail"
                                           data-xsd2html2xml-filled="true"
                                           value="{thumbnail}">
                                    <span>thumbnail</span>
                                </label>
                            </section>

                            <!-- Image -->
                            <section>
                                <label data-xsd2html2xml-namespace="https://cazzscookingcommunity.github.io"
                                       data-xsd2html2xml-type="element"
                                       data-xsd2html2xml-name="image"
                                       data-xsd2html2xml-xpath="/recipe/image" hidden="">
                                    <input type="text"
                                           onchange="if (this.value) { this.setAttribute('value', this.value); } else { this.removeAttribute('value'); };"
                                           required="required"
                                           pattern=".{0,}"
                                           data-xsd2html2xml-primitive="string"
                                           data-xsd2html2xml-description="image"
                                           disabled="">
                                    <span>image<button type="button" class="remove" onclick="clickRemoveButton(this);"></button></span>
                                </label>
                                <button type="button" class="add" data-xsd2html2xml-min="0" data-xsd2html2xml-max="1" onclick="clickAddButton(this);">image</button>
                            </section>

                            <!-- Category -->
                            <section>
                                <label data-xsd2html2xml-namespace="https://cazzscookingcommunity.github.io"
                                       data-xsd2html2xml-type="element"
                                       data-xsd2html2xml-name="category"
                                       data-xsd2html2xml-xpath="/recipe/category">
                                    <select onchange="this.childNodes.forEach(function(o) { if (o.nodeType == Node.ELEMENT_NODE) o.removeAttribute('selected'); }); this.children[this.selectedIndex].setAttribute('selected','selected');"
                                            required="required"
                                            data-xsd2html2xml-description="category"
                                            data-xsd2html2xml-primitive="string"
                                            data-xsd2html2xml-filled="true">
                                        <xsl:for-each select="categoryOptions">
                                            <option value="{.}" selected="{contains(., 'Dinner') ? 'selected' : ''}"><xsl:value-of select="."/></option>
                                        </xsl:for-each>
                                    </select>
                                    <span>category<button type="button" class="remove" onclick="clickRemoveButton(this);"></button></span>
                                </label>
                                <button type="button" class="add" data-xsd2html2xml-min="1" data-xsd2html2xml-max="3" onclick="clickAddButton(this);">category</button>
                            </section>

                            <!-- Yield -->
                            <section>
                                <label data-xsd2html2xml-namespace="https://cazzscookingcommunity.github.io"
                                       data-xsd2html2xml-type="element"
                                       data-xsd2html2xml-name="yield"
                                       data-xsd2html2xml-xpath="/recipe/yield" hidden="">
                                    <input type="text"
                                           onchange="if (this.value) { this.setAttribute('value', this.value); } else { this.removeAttribute('value'); };"
                                           required="required"
                                           pattern="\d*|\s{0}"
                                           data-xsd2html2xml-primitive="string"
                                           data-xsd2html2xml-description="yield"
                                           disabled="">
                                    <span>yield<button type="button" class="remove" onclick="clickRemoveButton(this);"></button></span>
                                </label>
                                <button type="button" class="add" data-xsd2html2xml-min="0" data-xsd2html2xml-max="1" onclick="clickAddButton(this);">yield</button>
                            </section>

                            <!-- PrepTime -->
                            <section>
                                <label data-xsd2html2xml-namespace="https://cazzscookingcommunity.github.io"
                                       data-xsd2html2xml-type="element"
                                       data-xsd2html2xml-name="prepTime"
                                       data-xsd2html2xml-xpath="/recipe/prepTime" hidden="">
                                    <input type="text"
                                           onchange="if (this.value) { this.setAttribute('value', this.value.replace(/\s+/g, ' ').trim()); } else { this.removeAttribute('value'); };"
                                           required="required"
                                           pattern=".{0,}"
                                           data-xsd2html2xml-primitive="token"
                                           data-xsd2html2xml-description="prepTime"
                                           disabled="">
                                    <span>prepTime<button type="button" class="remove" onclick="clickRemoveButton(this);"></button></span>
                                </label>
                                <button type="button" class="add" data-xsd2html2xml-min="0" data-xsd2html2xml-max="1" onclick="clickAddButton(this);">prepTime</button>
                            </section>

                            <!-- CookTime -->
                            <section>
                                <label data-xsd2html2xml-namespace="https://cazzscookingcommunity.github.io"
                                       data-xsd2html2xml-type="element"
                                       data-xsd2html2xml-name="cookTime"
                                       data-xsd2html2xml-xpath="/recipe/cookTime" hidden="">
                                    <input type="text"
                                           onchange="if (this.value) { this.setAttribute('value', this.value.replace(/\s+/g, ' ').trim()); } else { this.removeAttribute('value'); };"
                                           required="required"
                                           pattern=".{0,}"
                                           data-xsd2html2xml-primitive="token"
                                           data-xsd2html2xml-description="cookTime"
                                           disabled="">
                                    <span>cookTime<button type="button" class="remove" onclick="clickRemoveButton(this);"></button></span>
                                </label>
                                <button type="button" class="add" data-xsd2html2xml-min="0" data-xsd2html2xml-max="1" onclick="clickAddButton(this);">cookTime</button>
                            </section>

                            <!-- Ingredients -->
                            <section>
                                <label data-xsd2html2xml-namespace="https://cazzscookingcommunity.github.io"
                                       data-xsd2html2xml-type="element"
                                       data-xsd2html2xml-name="ingredients"
                                       data-xsd2html2xml-xpath="/recipe/ingredients">
                                    <textarea onchange="if (this.value) { this.setAttribute('value', this.value.replace(/\s+/g, ' ').trim()); } else { this.removeAttribute('value'); };"
                                              required="required"
                                              pattern=".{0,}"
                                              data-xsd2html2xml-primitive="string"
                                              data-xsd2html2xml-description="ingredients"
                                              data-xsd2html2xml-filled="true">{ingredients}</textarea>
                                    <span>ingredients</span>
                                </label>
                            </section>

                            <!-- Instructions -->
                            <section>
                                <label data-xsd2html2xml-namespace="https://cazzscookingcommunity.github.io"
                                       data-xsd2html2xml-type="element"
                                       data-xsd2html2xml-name="instructions"
                                       data-xsd2html2xml-xpath="/recipe/instructions">
                                    <textarea onchange="if (this.value) { this.setAttribute('value', this.value.replace(/\s+/g, ' ').trim()); } else { this.removeAttribute('value'); };"
                                              required="required"
                                              pattern=".{0,}"
                                              data-xsd2html2xml-primitive="string"
                                              data-xsd2html2xml-description="instructions"
                                              data-xsd2html2xml-filled="true">{instructions}</textarea>
                                    <span>instructions</span>
                                </label>
                            </section>

                            <!-- Tags -->
                            <section>
                                <label data-xsd2html2xml-namespace="https://cazzscookingcommunity.github.io"
                                       data-xsd2html2xml-type="element"
                                       data-xsd2html2xml-name="tags"
                                       data-xsd2html2xml-xpath="/recipe/tags">
                                    <input type="text"
                                           onchange="if (this.value) { this.setAttribute('value', this.value.replace(/\s+/g, ' ').trim()); } else { this.removeAttribute('value'); };"
                                           required="required"
                                           pattern=".{0,}"
                                           data-xsd2html2xml-primitive="string"
                                           data-xsd2html2xml-description="tags"
                                           data-xsd2html2xml-filled="true"
                                           value="{tags}">
                                    <span>tags</span>
                                </label>
                            </section>

                            <!-- Source -->
                            <section>
                                <label data-xsd2html2xml-namespace="https://cazzscookingcommunity.github.io"
                                       data-xsd2html2xml-type="element"
                                       data-xsd2html2xml-name="source"
                                       data-xsd2html2xml-xpath="/recipe/source" hidden="">
                                    <input type="text"
                                           onchange="if (this.value) { this.setAttribute('value', this.value); } else { this.removeAttribute('value'); };"
                                           required="required"
                                           pattern=".{0,}"
                                           data-xsd2html2xml-primitive="string"
                                           data-xsd2html2xml-description="source"
                                           disabled="">
                                    <span>source<button type="button" class="remove" onclick="clickRemoveButton(this);"></button></span>
                                </label>
                                <button type="button" class="add" data-xsd2html2xml-min="0" data-xsd2html2xml-max="1" onclick="clickAddButton(this);">source</button>
                            </section>
                        </fieldset>
                    </section>
                    <section>
                        <input type="submit" value="Submit">
                    </section>
                </form>
            </html:body>
        </html:html>
    </xsl:template>

    <!-- Template to handle XSD to HTML mapping -->
    <xsl:template match="xsd:schema">
        <!-- This template will process the XSD schema and generate corresponding HTML form elements -->
    </xsl:template>

</xsl:stylesheet>
