let blurStrength = 9; // Force du flou (1 = aucun flou, 2 = faible, 3+ = plus fort)
let smallCanvasSize = 50; // Taille réduite pour les calculs initiaux
let smallCanvas;

function setup() {
  createCanvas(400, 300, document.getElementById("background-canvas"));
  smallCanvas = createGraphics(smallCanvasSize, smallCanvasSize);
  noLoop(); // Empêche le draw d'être exécuté en boucle
}

function draw() {
  background(0);

  // Dessiner et flouter sur le canvas secondaire réduit
  drawAndBlurSmallCanvas();

  // Agrandir le canvas réduit sur le canvas principal
  image(smallCanvas, 0, 0, width, height);

  // Ajouter le bruit au canvas principal
  addNoiseToCanvas();
}

function drawAndBlurSmallCanvas() {
  const palettes = [
    color("#40C8B2"),
    color("#1D3F62"),
    color("#232323"),
    color("#3B57B8"),
    color("#072591"),
  ];

  smallCanvas.background(0);
  smallCanvas.noStroke();
  smallCanvas.drawingContext.filter = `blur(${blurStrength}px)`; // Flou sur le canvas réduit

  for (let i = 0; i < 100; i++) {
    smallCanvas.fill(palettes[Math.floor(Math.random() * 4)]);
    let size = random(10, 30); // Ajuster les tailles pour correspondre à la réduction
    smallCanvas.ellipse(
      random(smallCanvas.width),
      random(smallCanvas.height),
      size,
      size
    );
  }

  smallCanvas.drawingContext.filter = "none"; // Désactiver le filtre après le dessin
}

function addNoiseToCanvas() {
  loadPixels();
  let noiseScale = 0.5; // Réduction de la résolution du bruit
  console.log(height, width)
  for (let y = 0; y < height * 4; y++) {
    for (let x = 0; x < width * 4; x++) {
      // Calcul du bruit
      let n = noise(x * noiseScale / width, y * noiseScale / height);
      let noisedValue = random(-20, 20) * n;

      // // Accès direct aux pixels
      let index = (x + y * width) * 4;
      pixels[index] = constrain(pixels[index] + noisedValue, 0, 255); // Rouge
      pixels[index + 1] = constrain(pixels[index + 1] + noisedValue, 0, 255); // Vert
      pixels[index + 2] = constrain(pixels[index + 2] + noisedValue, 0, 255); // Bleu
      // Alpha inchangé (pixels[index + 3])


    }
  }
  updatePixels();
}


