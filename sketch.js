let img;
let palette = [];

let colorNumber = sessionStorage.getItem('numberOfColor');
if (!colorNumber) {
  colorNumber = 4;
  console.log("ERROR")
}

function preload() {
  // Remplace l'URL par celle de l'image que tu veux analyser
  let imgUrl = "https://picsum.photos/200/200";
  img = loadImage(imgUrl);
}

function setup() {
  var canvas = document.getElementById("colours-set");

  createCanvas(colorNumber * 100, 100, canvas);
  img.resize(200, 200); // Redimensionne pour faciliter l'analyse
  // image(img, 0, 0);

  extractPalette();
  displayPalette();
}

function extractPalette() {
  img.loadPixels();
  let colorCounts = {};

  // Parcourt tous les pixels de l'image
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let index = (x + y * img.width) * 4;
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      
      let colorKey = `${r},${g},${b}`;
      if (colorCounts[colorKey]) {
        colorCounts[colorKey]++;
      } else {
        colorCounts[colorKey] = 1;
      }
    }
  }

  // Trie les couleurs par fréquence
  let sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
  
  // Regroupe et filtre les couleurs similaires
  let threshold = 50; // Distance minimale pour considérer deux couleurs comme différentes
  palette = [];
  for (let i = 0; i < sortedColors.length && palette.length < colorNumber; i++) {
    let currentColor = sortedColors[i][0].split(',').map(Number);
    if (isDistinct(currentColor)) {
      palette.push(currentColor);
    }
  }
}

// Vérifie si une couleur est suffisamment différente des couleurs déjà sélectionnées
function isDistinct(color) {
  for (let existingColor of palette) {
    let distance = dist(color[0], color[1], color[2], existingColor[0], existingColor[1], existingColor[2]);
    if (distance < 50) {
      return false;
    }
  }
  return true;
}

function displayPalette() {
  for (let i = 0; i < palette.length; i++) {
    fill(palette[i]);
    noStroke();
    rect(i * 100, 0, 100, 100);
  }
}
