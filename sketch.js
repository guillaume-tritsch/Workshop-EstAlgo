let apiKey = "8af95cc9"; 


class ColorSource {
  constructor() {
    if (this.getColors === undefined) {
      throw new Error(
        "Classes dérivées doivent implémenter la méthode getColors()."
      );
    }
  }
}


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

    
    while (palette.length < numberOfColors) {
      let baseColor = random(palette); 
      let variation = this.generateColorVariation(baseColor); 
      palette.push(variation);
    }

    return palette;
  }

  
  generateColorVariation(baseColor) {
    let r = baseColor.levels[0];
    let g = baseColor.levels[1];
    let b = baseColor.levels[2];

    
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
        "The Matrix",
        "Avatar",
        "Titanic",
        "Interstellar",
        "Jaws",
        "Gladiator",
        "Up",
        "Frozen",
        "Toy Story",
        "The Lion King",
        "Finding Nemo",
        "Spirited Away",
        "Shrek",
        "Coco",
        "Wall-E",
        "Moana",
        "How to Train Your Dragon",
        "Ratatouille",
        "The Incredibles",
        "Kung Fu Panda",
        "Zootopia",
        "The Lego Movie",
        "Beauty and the Beast",
        "Aladdin",
        "Mulan",
        "The Little Mermaid",
        "Big Hero 6",
        "Inside Out",
        "Brave",
        "The Nightmare Before Christmas",
        "Despicable Me",
        "Madagascar",
        "The Secret Life of Pets",
        "Sing",
        "Tangled",
        "Monsters, Inc.",
      ];
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      const url = `https://www.omdbapi.com/?apikey=${this.apiKey}&t=${randomMovie}`;

      try {
        
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.Poster) {
          
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
  omdb: new OMDbSource(apiKey), 
};


var palette = [];
let colorNumber = sessionStorage.getItem("numberOfColor") || 4;
let selectedSource = sessionStorage.getItem("generationType") || "picsum";
let colorSource = colorSources[selectedSource];

let paletteUpdateResolve; 
let paletteUpdatePromise = new Promise((resolve, reject) => {
  paletteUpdateResolve = resolve; 
  console.log("eeee");
});

window.addEventListener("load", function () {
  console.log(selectedSource, colorSource);

  document.getElementById("colours-set").style.display = "none";
  switch (selectedSource) {
    case "picsum":
      this.document.getElementById("genType").innerText = "Online Pictures";
      break;
    case "random":
      this.document.getElementById("genType").innerText = "Random";
      break;
    case "omdb":
      this.document.getElementById("genType").innerText = "Movie Posters";

      break;
  }
});

async function setup() {
  createCanvas(colorNumber * 100, 200, document.getElementById("colours-set"));

  try {
    
    if (typeof colorSource.preload === "function") {
      await colorSource.preload();
    }

    palette = colorSource.getColors(colorNumber);

    let colorCodeElement = this.document.getElementById("color-code");
    colorCodeElement.style.width = `${colorNumber * 100}px`;
    colorCodeElement.style.height = `${200}px`;

    for (let index = 0; index < palette.length; index++) {
      const colorCodeC = palette[index];
      let divA = document.createElement("div");
      let pA = document.createElement("p");
      divA.appendChild(pA);
      divA.style.backgroundColor = `rgb(${colorCodeC.levels[0]},${colorCodeC.levels[1]},${colorCodeC.levels[2]})`;
      pA.innerText = `R${colorCodeC.levels[0]} G${colorCodeC.levels[1]} B${colorCodeC.levels[2]}`;
      colorCodeElement.appendChild(divA);
    }

    console.log("Palette avant tri :", palette);
    sortPaletteByHex(palette);
    console.log("Palette après tri :", palette);

    displayPalette();
  } catch (error) {
    console.error("Erreur dans la configuration :", error);
  }

  paletteUpdateResolve(palette); 
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


function rgbToHex(r, g, b) {
  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
}
