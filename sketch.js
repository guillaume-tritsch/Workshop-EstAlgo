let apiKey = "8af95cc9"; // Remplace par ta clé OMDb API

// Classe abstraite pour définir la structure de toute source de palette
class ColorSource {
  constructor() {
    if (this.getColors === undefined) {
      throw new Error(
        "Classes dérivées doivent implémenter la méthode getColors()."
      );
    }
  }
}

// Implémentation pour des couleurs aléatoires
class RandomColorSource extends ColorSource {
  getColors(numberOfColors) {
    let palette = [];
    for (let i = 0; i < numberOfColors; i++) {
      palette.push(color(random(255), random(255), random(255)));
    }
    return palette;
  }
}

class PicsumSource extends ColorSource {
  constructor() {
    super();
    this.img = null;
  }

  async preload() {
    return new Promise((resolve, reject) => {
      let imgUrl = "https://picsum.photos/200/200";

      this.img = loadImage(
        imgUrl,
        () => {
          console.log("Image chargée avec succès !");
          resolve();
        },
        () => {
          console.error("Erreur lors du chargement de l'image.");
          reject("Erreur de chargement de l'image.");
        }
      );
    });
  }

  getColors(numberOfColors) {
    let palette = [];
    let colorCounts = {};

    this.img.loadPixels();

    for (let y = 0; y < this.img.height; y++) {
      for (let x = 0; x < this.img.width; x++) {
        let index = (x + y * this.img.width) * 4;
        let r = this.img.pixels[index];
        let g = this.img.pixels[index + 1];
        let b = this.img.pixels[index + 2];

        let colorKey = `${r},${g},${b}`;
        colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
      }
    }

    let sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);

    let threshold = 50;
    for (
      let i = 0;
      i < sortedColors.length && palette.length < numberOfColors;
      i++
    ) {
      let currentColor = sortedColors[i][0].split(",").map(Number);
      if (this.isDistinct(currentColor, palette, threshold)) {
        palette.push(color(currentColor[0], currentColor[1], currentColor[2]));
      }
    }

    // Complète la palette si elle est incomplète
    while (palette.length < numberOfColors) {
      let baseColor = random(palette); // Choisit une couleur existante comme base
      let variation = this.generateColorVariation(baseColor); // Crée une variation harmonieuse
      palette.push(variation);
    }

    return palette;
  }

  // Génère une couleur harmonieuse basée sur une couleur existante
  generateColorVariation(baseColor) {
    let r = baseColor.levels[0];
    let g = baseColor.levels[1];
    let b = baseColor.levels[2];

    // Applique une variation légère sur chaque canal
    let newR = constrain(r + random(-30, 30), 0, 255);
    let newG = constrain(g + random(-30, 30), 0, 255);
    let newB = constrain(b + random(-30, 30), 0, 255);

    return color(newR, newG, newB);
  }

  isDistinct(color, palette, threshold) {
    for (let existingColor of palette) {
      let existingRGB = existingColor.levels;
      let distance = dist(
        color[0],
        color[1],
        color[2],
        existingRGB[0],
        existingRGB[1],
        existingRGB[2]
      );
      if (distance < threshold) {
        return false;
      }
    }
    return true;
  }
}
class OMDbSource extends ColorSource {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey;
    this.img = null;
  }

  preload() {
    return new Promise(async (resolve, reject) => {
      const movies = [
        "Inception",
        "Matrix",
        "Avatar",
        "Titanic",
        "Interstellar",
        "Jaws",
        "Gladiator",
        "Up",
      ];
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      const url = `https://www.omdbapi.com/?apikey=${this.apiKey}&t=${randomMovie}`;

      try {
        // Récupère les données du film
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.Poster) {
          // Charge l'image de l'affiche
          this.img = await loadImage(data.Poster, resolve, reject);
          this.img.resize(200, 200);
        } else {
          reject("Aucune affiche trouvée pour ce film.");
        }
      } catch (error) {
        reject("Erreur lors de la récupération de l'image.");
      }
    });
  }

  getColors(numberOfColors) {
    if (!this.img) {
      throw new Error("L'image n'a pas été chargée correctement.");
    }

    let palette = [];
    let colorCounts = {};

    this.img.loadPixels();

    for (let y = 0; y < this.img.height; y++) {
      for (let x = 0; x < this.img.width; x++) {
        let index = (x + y * this.img.width) * 4;
        let r = this.img.pixels[index];
        let g = this.img.pixels[index + 1];
        let b = this.img.pixels[index + 2];

        let colorKey = `${r},${g},${b}`;
        colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
      }
    }

    let sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);

    let threshold = 50;
    for (
      let i = 0;
      i < sortedColors.length && palette.length < numberOfColors;
      i++
    ) {
      let currentColor = sortedColors[i][0].split(",").map(Number);
      if (this.isDistinct(currentColor, palette, threshold)) {
        palette.push(color(currentColor[0], currentColor[1], currentColor[2]));
      }
    }

    return palette;
  }

  isDistinct(color, palette, threshold) {
    for (let existingColor of palette) {
      let existingRGB = existingColor.levels;
      let distance = dist(
        color[0],
        color[1],
        color[2],
        existingRGB[0],
        existingRGB[1],
        existingRGB[2]
      );
      if (distance < threshold) {
        return false;
      }
    }
    return true;
  }
}

let colorSources = {
  picsum: new PicsumSource(),
  random: new RandomColorSource(),
  omdb: new OMDbSource(apiKey), // Nouvelle source basée sur OMDb API
};

// Configuration globale
var palette = [];
let colorNumber = sessionStorage.getItem("numberOfColor") || 4;
let selectedSource = sessionStorage.getItem("generationType") || "picsum";
let colorSource = colorSources[selectedSource];

let paletteUpdateResolve; // Déclare la variable
let paletteUpdatePromise = new Promise((resolve, reject) => {
  paletteUpdateResolve = resolve; // Initialise la méthode `resolve`
  console.log("eeee");
});

window.addEventListener("load", function () {
  console.log(selectedSource, colorSource);

  document.getElementById("colours-set").style.display = "none";
});

async function setup() {
  createCanvas(colorNumber * 100, 200, document.getElementById("colours-set"));

  try {
    // Vérifie si la méthode preload existe avant de l'appeler
    if (typeof colorSource.preload === "function") {
      await colorSource.preload();
    }

    palette = colorSource.getColors(colorNumber);

    let colorCodeElement = this.document.getElementById("color-code")
    colorCodeElement.style.width = `${colorNumber * 100}px`
    colorCodeElement.style.height = `${200}px`

    for (let index = 0; index < palette.length; index++) {
      const colorCodeC = palette[index];
      let divA = document.createElement("div");
      let pA = document.createElement("p");
      divA.appendChild(pA);
      divA.style.backgroundColor = `rgb(${colorCodeC.levels[0]},${colorCodeC.levels[1]},${colorCodeC.levels[2]})`
      pA.innerText = `R${colorCodeC.levels[0]} G${colorCodeC.levels[1]} B${colorCodeC.levels[2]}`
      colorCodeElement.appendChild(divA)
    } 



    console.log("Palette avant tri :", palette);
    sortPaletteByHex(palette);
    console.log("Palette après tri :", palette);

    displayPalette();
  } catch (error) {
    console.error("Erreur dans la configuration :", error);
  }

  paletteUpdateResolve(palette); // Résolution de la promesse
}

function displayPalette() {
  for (let i = 0; i < palette.length; i++) {
    fill(palette[i]);
    noStroke();
    rect(i * 100, 0, 100, 200);
  }
  document.getElementById("colours-set").style.display = "block";
  document.getElementById("palette-loader").style.display = "none";
}

function sortPaletteByHex(palette) {
  return palette.sort((a, b) => {
    let hexA = rgbToHex(a.levels[0], a.levels[1], a.levels[2]);
    let hexB = rgbToHex(b.levels[0], b.levels[1], b.levels[2]);
    return hexA.localeCompare(hexB);
  });
}

// Convertir RGB en Hex
function rgbToHex(r, g, b) {
  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
}
