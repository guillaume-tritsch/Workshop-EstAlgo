function backgroundSketch(p) {
  let grid = [];
  let cols, rows;
  let spacing = 15; 
  let restoreSpeed = 0.05; 
  let escapeRadius = 30; 

  p.setup = function setup() {
    p.createCanvas(window.innerWidth / 1.5, window.innerHeight / 1.5, document.getElementById("background-canvas"));
    cols = p.floor(p.width / spacing);
    rows = p.floor(p.height / spacing);

    
    for (let i = 0; i < cols; i++) {
      grid[i] = [];
      for (let j = 0; j < rows; j++) {
        grid[i][j] = {
          x: i * spacing,
          y: j * spacing,
          color: p.color(p.random(50, 150), p.random(100, 200), 255), 
          originalColor: p.color(p.random(50, 150), p.random(100, 200), 255),
        };
      }
    }
  };

  p.draw = function draw() {
    p.background(255); 

    p.noStroke();

    
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let point = grid[i][j];

        
        let distance = p.dist(p.mouseX, p.mouseY, point.x, point.y);
        if (distance < escapeRadius) {
          
          point.color = p.color(255, 255, 255);
        } else {
          
          point.color = p.lerpColor(
            point.color,
            point.originalColor,
            restoreSpeed
          );
        }

        
        p.fill(point.color);
        p.rect(point.x, point.y, spacing, spacing);
      }
    }
  };
}

new p5(backgroundSketch);
