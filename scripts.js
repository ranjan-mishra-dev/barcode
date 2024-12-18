const scanButton = document.getElementById('scanButton');
const scanner = document.getElementById('scanner');
const output = document.getElementById('output');
const productName = document.getElementById('productName');
const productImage = document.getElementById('productImage');
const servingSize = document.getElementById('servingSize');
const nutritionTableBody = document.querySelector('#nutritionTable tbody');

scanButton.addEventListener('click', () => {
  scanner.classList.remove('hidden');
  Quagga.init({
    inputStream: {
      name: 'Live',
      type: 'LiveStream',
      target: scanner
    },
    decoder: {
      readers: ['ean_reader', 'upc_reader', 'i2of5_reader', 'qr_reader', 'code_39_reader', 'upc_reader', 'ean_8_reader', 'code_128_reader'] // Adjust if needed for other barcode types
    }
  }, err => {
    if (err) {
      console.error(err);
      return;
    }
    Quagga.start();
  });

  Quagga.onDetected(data => {
    const barcode = data.codeResult.code;
    fetchNutritionData(barcode);
    Quagga.stop();
    scanner.classList.add('hidden');
  });
});

function fetchNutritionData(barcode) {
  const apiUrl = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.status === 1) {
        displayProductInfo(data.product);
      } else {
        alert('Product not found!');
      }
    })
    .catch(err => console.error(err));
}

function displayProductInfo(product) {
  output.classList.remove('hidden');
  productName.textContent = product.product_name || 'N/A';
  productImage.src = product.image_url || '';
  productImage.alt = product.product_name || 'Product Image';
  servingSize.textContent = `Serving Size: ${product.serving_size || 'N/A'}`;

  const nutrients = product.nutriments || {};
  nutritionTableBody.innerHTML = `
    <tr><td>Calories</td><td>${nutrients['energy-kcal_100g'] || 'N/A'} kcal</td></tr>
    <tr><td>Protein</td><td>${nutrients.proteins_100g || 'N/A'} g</td></tr>
    <tr><td>Carbs</td><td>${nutrients.carbohydrates_100g || 'N/A'} g</td></tr>
    <tr><td>Fats</td><td>${nutrients.fat_100g || 'N/A'} g</td></tr>
    <tr><td>Saturated Fats</td><td>${nutrients['saturated-fat_100g'] || 'N/A'} g</td></tr>
    <tr><td>Sugar</td><td>${nutrients.sugars_100g || 'N/A'} g</td></tr>
    <tr><td>Salt</td><td>${nutrients.salt_100g || 'N/A'} g</td></tr>
  `;
}
