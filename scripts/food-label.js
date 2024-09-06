function displayHealthLabel(data, yield) {
    
    const calories = Math.round(data.calories / yield);
    // Retrieve nutrients from API, divide by yield, and round to the nearest integer
    const totalFat = Math.round(data.totalNutrients.FAT.quantity / yield);
    const saturatedFat = data.totalNutrients.FASAT ? Math.round(data.totalNutrients.FASAT.quantity / yield) : 0;
    const transFat = data.totalNutrients.FATRN ? Math.round(data.totalNutrients.FATRN.quantity / yield) : 0;
    const cholesterol = data.totalNutrients.CHOLE ? Math.round(data.totalNutrients.CHOLE.quantity / yield) : 0;
    const sodium = Math.round(data.totalNutrients.NA.quantity / yield);
    const totalCarbohydrate = Math.round(data.totalNutrients.CHOCDF.quantity / yield);
    const dietaryFiber = Math.round(data.totalNutrients.FIBTG.quantity / yield);
    const totalSugars = Math.round(data.totalNutrients.SUGAR.quantity / yield);
    const addedSugars = data.totalNutrients.SUGAR.added ? Math.round(data.totalNutrients.SUGAR.added / yield) : 0;
    const protein = Math.round(data.totalNutrients.PROCNT.quantity / yield);
    const vitaminD = data.totalNutrients.VITD ? Math.round(data.totalNutrients.VITD.quantity / yield) : 0;
    const calcium = Math.round(data.totalNutrients.CA.quantity / yield);
    const iron = Math.round(data.totalNutrients.FE.quantity / yield);
    const potassium = Math.round(data.totalNutrients.K.quantity / yield);

    // Use percentage daily values from API
    const fatDailyValue = data.totalDaily.FAT ? (data.totalDaily.FAT.quantity / yield).toFixed(0) + ' %' : 'N/A';
    const saturatedFatDailyValue = data.totalDaily.FASAT ? (data.totalDaily.FASAT.quantity / yield).toFixed(0) + ' %' : 'N/A';
    const cholesterolDailyValue = data.totalDaily.CHOLE ? (data.totalDaily.CHOLE.quantity / yield).toFixed(0) + ' %' : 'N/A';
    const sodiumDailyValue = data.totalDaily.NA ? (data.totalDaily.NA.quantity / yield).toFixed(0) + ' %' : 'N/A';
    const carbDailyValue = data.totalDaily.CHOCDF ? (data.totalDaily.CHOCDF.quantity / yield).toFixed(0) + ' %' : 'N/A';
    const fiberDailyValue = data.totalDaily.FIBTG ? (data.totalDaily.FIBTG.quantity / yield).toFixed(0) + ' %' : 'N/A';
    const proteinDailyValue = data.totalDaily.PROCNT ? (data.totalDaily.PROCNT.quantity / yield).toFixed(0) + ' %' : 'N/A';
    const vitaminDDailyValue = data.totalDaily.VITD ? (data.totalDaily.VITD.quantity / yield).toFixed(0) + ' %' : 'N/A';
    const calciumDailyValue = data.totalDaily.CA ? (data.totalDaily.CA.quantity / yield).toFixed(0) + ' %' : 'N/A';
    const ironDailyValue = data.totalDaily.FE ? (data.totalDaily.FE.quantity / yield).toFixed(0) + ' %' : 'N/A';
    const potassiumDailyValue = data.totalDaily.K ? (data.totalDaily.K.quantity / yield).toFixed(0) + ' %' : 'N/A';

    const nutritionHtml = `
        <div class="performance-facts">
            <div class="performance-facts__header">
                <h1 class="performance-facts__title">Nutrition Facts</h1>
                <p><span id="lnumser">${yield}</span> servings per container</p>
            </div>
            <table class="performance-facts__table">
                <thead>
                    <tr>
                        <th colspan="3" class="amps">Amount Per Serving</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th colspan="2" id="lkcal-val-cal"><b>Calories</b></th>
                        <td class="nob">${calories}</td>
                    </tr>
                    <tr class="thick-row">
                        <td colspan="3" class="small-info"><b>% Daily Value*</b></td>
                    </tr>
                    <tr>
                        <th colspan="2"><b>Total Fat</b> ${totalFat} g</th>
                        <td><b>${fatDailyValue}</b></td>
                    </tr>
                    <tr>
                        <td class="blank-cell"></td>
                        <th>Saturated Fat ${saturatedFat} g</th>
                        <td><b>${saturatedFatDailyValue}</b></td>
                    </tr>
                    <tr>
                        <td class="blank-cell"></td>
                        <th>Trans Fat ${transFat} g</th>
                        <td></td>
                    </tr>
                    <tr>
                        <th colspan="2"><b>Cholesterol</b> ${cholesterol} mg</th>
                        <td><b>${cholesterolDailyValue}</b></td>
                    </tr>
                    <tr>
                        <th colspan="2"><b>Sodium</b> ${sodium} mg</th>
                        <td><b>${sodiumDailyValue}</b></td>
                    </tr>
                    <tr>
                        <th colspan="2"><b>Total Carbohydrate</b> ${totalCarbohydrate} g</th>
                        <td><b>${carbDailyValue}</b></td>
                    </tr>
                    <tr>
                        <td class="blank-cell"></td>
                        <th>Dietary Fiber ${dietaryFiber} g</th>
                        <td><b>${fiberDailyValue}</b></td>
                    </tr>
                    <tr>
                        <td class="blank-cell"></td>
                        <th>Total Sugars ${totalSugars} g</th>
                        <td></td>
                    </tr>
                    <tr>
                        <td class="blank-cell"></td>
                        <th>Includes ${addedSugars} Added Sugars</th>
                        <td></td>
                    </tr>
                    <tr class="thick-end">
                        <th colspan="2"><b>Protein</b> ${protein} g</th>
                        <td><b>${proteinDailyValue}</b></td>
                    </tr>
                </tbody>
            </table>
            <table class="performance-facts__table--grid">
                <tbody>
                    <tr>
                        <th>Vitamin D ${vitaminD} µg</th>
                        <td><b>${vitaminDDailyValue}</b></td>
                    </tr>
                    <tr>
                        <th>Calcium ${calcium} mg</th>
                        <td><b>${calciumDailyValue}</b></td>
                    </tr>
                    <tr>
                        <th>Iron ${iron} mg</th>
                        <td><b>${ironDailyValue}</b></td>
                    </tr>
                    <tr class="thin-end">
                        <th>Potassium ${potassium} mg</th>
                        <td><b>${potassiumDailyValue}</b></td>
                    </tr>
                </tbody>
            </table>
            <p class="small-info" id="small-nutrition-info">*Percent Daily Values are based on a 2,000 calorie diet.</p>
        </div>
    `;

    // Insert into the HTML
    document.getElementById('food-label').innerHTML = nutritionHtml;
}
