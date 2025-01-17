palettesGradient = [];

function gradientSketch(p) {
  let blurStrength = 15; 
  let smallCanvasSize = 75; 
  let smallCanvas;

  p.setup = function setup() {
    p.createCanvas(palettesGradient.length * 100, 200, document.getElementById("preview-gradient"));
    smallCanvas = p.createGraphics(palettesGradient.length * 20, 40);
    p.noLoop(); 
  };

  p.draw = function draw() {
    displayPalette();
    
    drawAndBlurSmallCanvas();

    
    p.image(smallCanvas, 0, 0, p.width, p.height);

    
    
  };


function displayPalette() {
  for (let i = 0; i < palettesGradient.length; i++) {
    p.fill(palettesGradient[i]);
    p.noStroke();
    p.rect(i * 100, 0, 100, 200);
  }
}


  function drawAndBlurSmallCanvas() {
    const palettes = palettesGradient;

    smallCanvas.noStroke();
    smallCanvas.drawingContext.filter = `blur(${blurStrength}px)`; 

    for (let i = 0; i < 200; i++) {
      smallCanvas.fill(palettes[Math.floor(Math.random() * 4)]);
      let size = p.random(10, 20); 
      smallCanvas.ellipse(
        p.random(smallCanvas.width),
        p.random(smallCanvas.height),
        size,
        size
      );
    }

    smallCanvas.drawingContext.filter = "none"; 
  }
}

function mondrianSketch(p) {

  let palette = palettesGradient
  let usedColors = []; 
  
  p.setup = function setup() {
    p.createCanvas(palettesGradient.length * 100, 200, document.getElementById("preview-shape"));
    p.noLoop();
    p.noFill();
    p.strokeWeight(1); 
    p.stroke(0); 
  }
  
  p.draw = function draw() {
    p.background(255); 
    generateMondrian(0, 0, p.width, p.height, 4); 
  
    
    if (usedColors.length < palette.length) {
      fillRemainingColors();
    }
  }
  
  
  function generateMondrian(x, y, w, h, depth) {
    if (depth <= 0 || (w < 50 && h < 50)) {
      let color = getNextColor();
      if (color) {
        p.fill(color);
        p.rect(x, y, w, h);
      }
      return;
    }
  
    let splitVertical = p.random() > 0.5; 
    if (splitVertical) {
      let splitX = p.random(x + w * 0.3, x + w * 0.7); 
      p.line(splitX, y, splitX, y + h);
      generateMondrian(x, y, splitX - x, h, depth - 1);
      generateMondrian(splitX, y, x + w - splitX, h, depth - 1);
    } else {
      let splitY = p.random(y + h * 0.3, y + h * 0.7); 
      p.line(x, splitY, x + w, splitY);
      generateMondrian(x, y, w, splitY - y, depth - 1);
      generateMondrian(x, splitY, w, y + h - splitY, depth - 1);
    }
  }
  
  
  function getNextColor() {
    if (usedColors.length < palette.length) {
      let color = palette[usedColors.length];
      usedColors.push(color);
      return color;
    } else if (p.random() > 0.3) { 
      return p.random(palette);
    }
    return null;
  }
  
  
  function fillRemainingColors() {
    let remainingColors = palette.filter(c => !usedColors.includes(c));
    for (let color of remainingColors) {
      let x = p.random(p.width);
      let y = p.random(p.height);
      let w = p.random(50, 100); 
      let h = p.random(50, 100);
      p.fill(color);
      p.rect(x, y, w, h);
    }
  }
  

}


window.addEventListener("load", function () {
  document.getElementById("preview-gradient").style.display = "none";
  document.getElementById("preview-shape").style.display = "none"

  paletteUpdatePromise.then((value) => {
    palettesGradient = value;
    new p5(gradientSketch);
    document.getElementById("gradient-loader").style.display = "none";
    document.getElementById("preview-gradient").style.display = "block";

    new p5(mondrianSketch)
    document.getElementById("shape-loader").style.display = "none"
    document.getElementById("preview-shape").style.display = "block"

  });
});
