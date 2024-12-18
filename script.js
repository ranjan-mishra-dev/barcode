const barcode = "7622201150419"; // Example barcode
const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;

// Fetch product data
fetch(url)
  .then(response => response.json())
  .then(data => {
    if (data.status === 1) {
      // Extract relevant information
      const nutriments = data.product.nutriments;
      const nutrition = {
        calories: nutriments['energy-kcal'] || "N/A",
        fat: nutriments['fat_100g'] || "N/A",
        saturatedFat: nutriments['saturated-fat_100g'] || "N/A",
        carbs: nutriments['carbohydrates_100g'] || "N/A",
        sugar: nutriments['sugars_100g'] || "N/A",
        protein: nutriments['proteins_100g'] || "N/A",
        salt: nutriments['salt_100g'] || "N/A",
        serving_size: nutriments['serving_quantity'] || "N/A",
      };

      // Display the data
      const container = document.getElementById("nutrition-info");
      container.innerHTML = `
        <h3>Nutritional Information (per 100g)</h3>
        <table>
          <tr><td>Calories</td><td>${nutrition.calories} kcal</td></tr>
          <tr><td>Fat</td><td>${nutrition.fat} g</td></tr>
          <tr><td>Saturated Fat</td><td>${nutrition.saturatedFat} g</td></tr>
          <tr><td>Carbohydrates</td><td>${nutrition.carbs} g</td></tr>
          <tr><td>Sugars</td><td>${nutrition.sugar} g</td></tr>
          <tr><td>Protein</td><td>${nutrition.protein} g</td></tr>
          <tr><td>Salt</td><td>${nutrition.salt} g</td></tr>
          <tr><td>Serving Size</td><td>${nutrition.serving_size} g</td></tr>
        </table>
      `;
    } else {
      console.error("Product not found");
    }
  })
  .catch(error => console.error("Error fetching data:", error));
