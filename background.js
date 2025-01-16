function backgroundSketch(p) {
  let grid = [];
  let cols, rows;
  let spacing = 15; // Espacement entre les points du grid
  let restoreSpeed = 0.05; // Vitesse à laquelle la gelée revient en place
  let escapeRadius = 30; // Rayon d'interaction de la souris

  p.setup = function setup() {
    p.createCanvas(window.innerWidth / 1.5, window.innerHeight / 1.5, document.getElementById("background-canvas"));
    cols = p.floor(p.width / spacing);
    rows = p.floor(p.height / spacing);

    // Initialiser le grid avec des couleurs aléatoires
    for (let i = 0; i < cols; i++) {
      grid[i] = [];
      for (let j = 0; j < rows; j++) {
        grid[i][j] = {
          x: i * spacing,
          y: j * spacing,
          color: p.color(p.random(50, 150), p.random(100, 200), 255), // Nuances de bleu
          originalColor: p.color(p.random(50, 150), p.random(100, 200), 255),
        };
      }
    }
  };

  p.draw = function draw() {
    p.background(255); // Fond blanc

    p.noStroke();

    // Dessiner la texture
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let point = grid[i][j];

        // Vérifier la distance entre la souris et le point
        let distance = p.dist(p.mouseX, p.mouseY, point.x, point.y);
        if (distance < escapeRadius) {
          // Si la souris est proche, rendre la couleur blanche
          point.color = p.color(255, 255, 255);
        } else {
          // Graduellement restaurer la couleur d'origine
          point.color = p.lerpColor(
            point.color,
            point.originalColor,
            restoreSpeed
          );
        }

        // Dessiner un rectangle avec une taille aléatoire pour simuler une forme liquide
        p.fill(point.color);
        p.rect(point.x, point.y, spacing, spacing);
      }
    }
  };
}

new p5(backgroundSketch);
